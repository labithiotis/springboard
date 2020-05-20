import { User, UserRoles } from '_shared/types/types';
import bcrypt from 'bcrypt';
import { Db } from 'mongodb';
import uuid from 'short-uuid';

import config from '../../config/config';
import { Logger } from '../../utils/logger';
import { userDatabaseSchema } from './schema';

export const USERS_COLLECTION = 'users';

const projections = {
  user: {
    _id: 0,
    password: 0,
  },
  userWithPassword: {
    _id: 0,
  },
};

export class UsersStore {
  constructor(private logger: Logger, private db: Db) {}

  async init() {
    await this.db.createCollection(USERS_COLLECTION);
    const users = this.db.collection(USERS_COLLECTION);

    await this.db.command({
      collMod: USERS_COLLECTION,
      validator: {
        $jsonSchema: userDatabaseSchema,
      },
    });

    await users.createIndex({ accountId: 1 }, { background: true });
    await users.createIndex({ userId: 1 }, { background: true, unique: true });
    await users.createIndex({ username: 1 }, { background: true, unique: true });
  }

  async createUser(user: {
    username: string;
    password: string;
    role?: UserRoles;
    accountId?: string;
    workingHours?: number;
  }): Promise<User> {
    const newUser: User = {
      userId: uuid.generate(),
      accountId: user.accountId || uuid.generate(),
      username: user.username.toLowerCase(),
      password: await bcrypt.hash(user.password, config.HASH_SALT_ROUNDS),
      role: user.role || UserRoles.user,
      workingHours: user.workingHours || 9,
    };

    await this.db.collection(USERS_COLLECTION).insertOne({ ...newUser });
    return newUser;
  }

  async getUsers(accountId: string): Promise<User[]> {
    return this.db.collection(USERS_COLLECTION).find({ accountId }, { projection: projections.user }).toArray();
  }

  async getUserById(userId: string): Promise<User | null> {
    return this.db.collection(USERS_COLLECTION).findOne({ userId }, { projection: projections.user });
  }

  async updateUserById(userId: string, user: User): Promise<User | undefined> {
    const newUser: User = {
      ...user,
      username: user.username.toLowerCase(),
    };

    if (user.password) {
      newUser.password = await bcrypt.hash(user.password, config.HASH_SALT_ROUNDS);
    }

    const response = await this.db.collection(USERS_COLLECTION).updateOne({ userId }, { $set: newUser });
    return !!response.result.ok ? newUser : undefined;
  }

  async deleteUserById(userId: string): Promise<boolean> {
    const result = await this.db.collection(USERS_COLLECTION).deleteOne({ userId });
    return !!result.deletedCount;
  }

  async getUserByUsername(username: string): Promise<User | null> {
    return this.db.collection(USERS_COLLECTION).findOne({ username }, { projection: projections.userWithPassword });
  }
}
