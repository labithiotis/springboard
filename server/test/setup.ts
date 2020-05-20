import { MongoMemoryServer } from 'mongodb-memory-server';

module.exports = async () => {
  // Running before all tests to allow downloading of MongoDB
  const mongoServer = new MongoMemoryServer({ autoStart: false });
  await mongoServer.start();
  await mongoServer.stop();
};
