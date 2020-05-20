import { mockHour } from '_shared/mocks/users';
import { jsonify } from '_shared/utils/jsonify';
import { randomPort, randomString } from '_shared/utils/random';
import axiosist from 'axiosist';
import * as http from 'http';
import { Collection, MongoClient } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';

import { App } from '../../App';
import { DB_NAME, MongoDatabase } from '../../Database';
import { InMemoryLogger } from '../../utils/logger';
import { HOURS_COLLECTION } from './Store';

jest.mock('../Auth/Auth');
import { Auth } from '../Auth/Auth';

const isAuthenticated = jest.fn((_req, _res, next) => next());
Auth.isAuthenticated = () => isAuthenticated;

describe('Hours', () => {
  let app: App;
  let server: http.Server;
  let mongo: MongoMemoryServer;
  let mongoClient: MongoClient;
  let hoursCollection: Collection;

  beforeAll(async () => {
    mongo = new MongoMemoryServer();
    mongoClient = await MongoClient.connect(await mongo.getUri(), { useUnifiedTopology: true });
    hoursCollection = mongoClient.db(DB_NAME).collection(HOURS_COLLECTION);
    app = await new App(InMemoryLogger(), new MongoDatabase(InMemoryLogger(), mongoClient));
    server = await app.listen(randomPort());
  });

  afterAll(async () => {
    await app.close();
    await mongo.stop();
  });

  it('can create hours', async () => {
    const accountId = randomString();
    const userId = randomString();
    const hour = { date: new Date().toISOString(), hours: 8, notes: 'note1' };

    const response = await axiosist(server).post(`/account/${accountId}/users/${userId}/hours`, hour);

    expect(isAuthenticated).toBeCalled();
    expect(response.data).toEqual({
      ...hour,
      accountId,
      userId,
      hourId: expect.any(String),
      _id: undefined,
    });
    expect(response.status).toBe(200);

    const dbHour = await hoursCollection.findOne({ accountId });
    expect(jsonify(dbHour)).toMatchObject(response.data);
  });

  it('rejects create if request fails validation', async () => {
    const accountId = randomString();
    const userId = randomString();

    const response = await axiosist(server).post(`/account/${accountId}/users/${userId}/hours`, {});

    expect(response.status).toBe(400);
    expect(response.data.errors.length > 0).toBe(true);
  });

  it('returns all hours for that user', async () => {
    const accountId = randomString();
    const userId = randomString();
    const hour1 = mockHour({ userId });
    const hour2 = mockHour({ userId: randomString() });
    const hour3 = mockHour({ userId });
    await hoursCollection.insertMany([{ ...hour1 }, { ...hour2 }, { ...hour3 }]);

    const response = await axiosist(server).get(`/account/${accountId}/users/${userId}/hours`);

    expect(isAuthenticated).toBeCalled();
    expect(response.data.length).toBe(2);
    expect(response.data).toEqual(jsonify([hour1, hour3]));
    expect(response.status).toBe(200);
  });

  it('can update hours', async () => {
    const accountId = randomString();
    const userId = randomString();
    const hourId = randomString();
    const hour = mockHour({ accountId, userId, hourId, hours: 2 });
    await hoursCollection.insertMany([{ ...hour }]);

    const response = await axiosist(server).put(`/account/${accountId}/users/${userId}/hours/${hourId}`, {
      date: hour.date,
      notes: hour.notes,
      hours: 3,
    });

    expect(isAuthenticated).toBeCalled();
    expect(response.data).toEqual(jsonify({ ...hour, accountId, userId, hourId, hours: 3 }));
    expect(response.status).toBe(200);

    const dbHour = await hoursCollection.findOne({ hourId });
    expect(dbHour.hours).toBe(3);
  });

  it('rejects updates if request fails validation', async () => {
    const accountId = randomString();
    const userId = randomString();
    const hourId = randomString();

    const response = await axiosist(server).put(`/account/${accountId}/users/${userId}/hours/${hourId}`, {});

    expect(response.status).toBe(400);
    expect(response.data.errors.length > 0).toBe(true);
  });

  it('can delete hours', async () => {
    const accountId = randomString();
    const userId = randomString();
    const hourId = randomString();
    const hour = mockHour({ accountId, userId, hourId });
    await hoursCollection.insertMany([{ ...hour }]);

    const response = await axiosist(server).delete(`/account/${accountId}/users/${userId}/hours/${hourId}`);

    expect(isAuthenticated).toBeCalled();
    expect(response.status).toBe(200);

    const dbHour = await hoursCollection.findOne({ hourId });
    expect(dbHour).toBe(null);
  });
});
