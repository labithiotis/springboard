import { mockUser } from '_shared/mocks/users';
import bcrypt from 'bcrypt';
import * as http from 'http';
import { MongoClient } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';
import axiosist from 'axiosist';

import { App } from '../../App';
import config from '../../config/config';
import { DB_NAME, MongoDatabase } from '../../Database';
import { InMemoryLogger } from '../../utils/logger';
import { randomPort, randomString } from '_shared/utils/random';
import { USERS_COLLECTION } from '../Users/Store';

describe('Auth', () => {
  let app: App;
  let server: http.Server;
  let mongo: MongoMemoryServer;
  let mongoClient: MongoClient;

  beforeAll(async () => {
    mongo = new MongoMemoryServer();
    mongoClient = await MongoClient.connect(await mongo.getUri(), { useUnifiedTopology: true });
    app = await new App(InMemoryLogger(), new MongoDatabase(InMemoryLogger(), mongoClient));
    server = await app.listen(randomPort());
  });

  afterAll(async () => {
    await app.close();
    await mongo.stop();
  });

  it('can login when username and password are correct', async () => {
    const username = randomString();
    const password = randomString();
    const hashedPassword = await bcrypt.hash(password, config.HASH_SALT_ROUNDS);
    const user = mockUser({ username, password: hashedPassword });
    await mongoClient
      .db(DB_NAME)
      .collection(USERS_COLLECTION)
      .insertOne({ ...user });

    const response = await axiosist(server).post('/login', { username, password });

    expect(response.status).toBe(200);
    expect(response.data).toEqual({ ...user, password: undefined });
  });

  it('fails login when password is incorrect', async () => {
    const username = randomString();
    const password = randomString();
    const hashedPassword = await bcrypt.hash(password, config.HASH_SALT_ROUNDS);
    const user = mockUser({ username, password: hashedPassword });
    await mongoClient
      .db(DB_NAME)
      .collection(USERS_COLLECTION)
      .insertOne({ ...user });

    const response = await axiosist(server).post('/login', { username, password: randomString() });

    expect(response.status).toBe(401);
  });
});
