import { mockUser } from '_shared/mocks/users';
import { UserRoles } from '_shared/types/types';
import { jsonify } from '_shared/utils/jsonify';
import * as http from 'http';
import { Collection, MongoClient } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';
import axiosist from 'axiosist';

import { App } from '../../App';
import { DB_NAME, MongoDatabase } from '../../Database';
import { InMemoryLogger } from '../../utils/logger';
import { randomPort, randomString } from '_shared/utils/random';
import { USERS_COLLECTION } from './Store';

jest.mock('../Auth/Auth');
import { Auth } from '../Auth/Auth';

const isAuthenticated = jest.fn((_req, _res, next) => next());
Auth.isAuthenticated = () => isAuthenticated;

describe('Users', () => {
  let app: App;
  let server: http.Server;
  let mongo: MongoMemoryServer;
  let mongoClient: MongoClient;
  let usersCollection: Collection;

  beforeAll(async () => {
    mongo = new MongoMemoryServer();
    mongoClient = await MongoClient.connect(await mongo.getUri(), { useUnifiedTopology: true });
    usersCollection = mongoClient.db(DB_NAME).collection(USERS_COLLECTION);
    app = await new App(InMemoryLogger(), new MongoDatabase(InMemoryLogger(), mongoClient));
    server = await app.listen(randomPort());
  });

  afterAll(async () => {
    await app.close();
    await mongo.stop();
  });

  it('can create users if admin', async () => {
    const accountId = randomString();
    const user = { ...mockUser(), accountId: undefined, userId: undefined };

    const response = await axiosist(server).post(`/account/${accountId}/users`, user);

    expect(isAuthenticated).toBeCalled();
    expect(response.status).toBe(200);
    expect(response.data).toEqual({
      ...user,
      accountId,
      userId: expect.any(String),
      password: expect.any(String),
      _id: undefined,
    });

    const dbUser = await usersCollection.findOne({ accountId });
    expect(jsonify(dbUser)).toMatchObject(response.data);
  });

  it('rejects create if request fails validation', async () => {
    const accountId = randomString();
    const userId = randomString();

    const response = await axiosist(server).put(`/account/${accountId}/users/${userId}`, {});

    expect(response.status).toBe(400);
    expect(response.data.errors.length > 0).toBe(true);
  });

  it('returns a single user', async () => {
    const accountId = randomString();
    const userId = randomString();
    const user = mockUser({ userId, accountId });
    await usersCollection.insertMany([{ ...user }]);

    const response = await axiosist(server).get(`/account/${accountId}/users/${userId}`);

    expect(isAuthenticated).toBeCalled();
    expect(response.status).toBe(200);
    expect(response.data).toEqual({ ...user, password: undefined, _id: undefined });
  });

  it('returns all users for that account', async () => {
    const accountId = randomString();
    const user1 = mockUser({ username: 'user1', accountId });
    const user2 = mockUser({ username: 'user2', accountId, role: UserRoles.admin });
    const user3 = mockUser({ username: 'user3', accountId: randomString() });
    await usersCollection.insertMany([{ ...user1 }, { ...user2 }, { ...user3 }]);

    const response = await axiosist(server).get(`/account/${accountId}/users`);

    expect(isAuthenticated).toBeCalled();
    expect(response.data).toEqual([
      { ...user1, password: undefined },
      { ...user2, password: undefined },
    ]);
    expect(response.status).toBe(200);
  });

  it('can update users working hours if admin', async () => {
    const accountId = randomString();
    const userId = randomString();
    const user = mockUser({ userId, accountId, workingHours: 2 });
    await usersCollection.insertMany([{ ...user }]);

    const response = await axiosist(server).put(`/account/${accountId}/users/${userId}`, { ...user, workingHours: 3 });

    expect(isAuthenticated).toBeCalled();
    expect(response.data).toEqual({ ...user, workingHours: 3, password: undefined, _id: undefined });
    expect(response.status).toBe(200);

    const dbUser = await usersCollection.findOne({ userId });
    expect(dbUser.workingHours).toBe(3);
  });

  it('can update without password if admin', async () => {
    const accountId = randomString();
    const userId = randomString();
    const user = mockUser({ userId, accountId });
    await usersCollection.insertMany([{ ...user }]);

    const response = await axiosist(server).put(`/account/${accountId}/users/${userId}`, {
      ...user,
      password: undefined,
    });

    expect(isAuthenticated).toBeCalled();
    expect(response.status).toBe(200);
  });

  it('rejects updates if request fails validation', async () => {
    const userId = randomString();
    const accountId = randomString();
    const user1 = mockUser({ userId, accountId, workingHours: -1 });

    const response = await axiosist(server).put(`/account/${accountId}/users/${userId}`, user1);

    expect(response.status).toBe(400);
    expect(response.data.errors.length > 0).toBe(true);
  });

  it('can delete users if admin', async () => {
    const accountId = randomString();
    const userId = randomString();
    const user1 = mockUser({ userId, accountId });
    await usersCollection.insertMany([{ ...user1 }]);

    const response = await axiosist(server).delete(`/account/${accountId}/users/${userId}`);

    expect(isAuthenticated).toBeCalled();
    expect(response.status).toBe(200);

    const dbUser = await usersCollection.findOne({ userId });
    expect(dbUser).toBe(null);
  });
});
