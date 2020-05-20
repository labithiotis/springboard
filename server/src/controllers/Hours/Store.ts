import { Hour } from '_shared/types/types';
import { Db, QuerySelector } from 'mongodb';
import uuid from 'short-uuid';
import { Logger } from '../../utils/logger';
import { hoursDatabaseSchema } from './schema';

export const HOURS_COLLECTION = 'hours';

const projections = {
  hours: {
    _id: 0,
  },
};

export class HoursStore {
  constructor(private logger: Logger, private db: Db) {}

  async init() {
    await this.db.createCollection(HOURS_COLLECTION);
    const hours = this.db.collection(HOURS_COLLECTION);

    await this.db.command({
      collMod: HOURS_COLLECTION,
      validator: {
        $jsonSchema: hoursDatabaseSchema,
      },
    });

    await hours.createIndex({ accountId: 1 }, { background: true });
    await hours.createIndex({ userId: 1 }, { background: true });
    await hours.createIndex({ hourId: 1 }, { background: true, unique: true });
    await hours.createIndex({ date: 1 }, { background: true });
  }

  async createHour(hour: {
    userId: string;
    accountId: string;
    date: string;
    hours: number;
    notes: string;
  }): Promise<Hour> {
    const newHour: Hour = {
      hourId: uuid.generate(),
      userId: hour.userId,
      accountId: hour.accountId,
      date: new Date(hour.date),
      hours: hour.hours,
      notes: hour.notes,
    };

    await this.db.collection(HOURS_COLLECTION).insertOne({ ...newHour });
    return newHour;
  }

  async getHours(userId: string, params: { fromDate?: string; toDate?: string } = {}): Promise<Hour[]> {
    let dateFilter: { [key: string]: QuerySelector<any> } = {};
    if (params.fromDate || params.toDate) {
      dateFilter.date = {};
      if (params.fromDate) {
        dateFilter.date.$gte = new Date(params.fromDate.split('T')[0]);
      }
      if (params.toDate) {
        dateFilter.date.$lte = new Date(new Date(params.toDate.split('T')[0]).getTime() + 1000 * 60 * 60 * 24);
      }
    }
    return this.db
      .collection(HOURS_COLLECTION)
      .find({ userId, ...dateFilter }, { projection: projections.hours })
      .sort({ date: 1 })
      .toArray();
  }

  async updateHourById(hourId: string, hour: Hour): Promise<Hour | undefined> {
    const newHour: Hour = { ...hour, date: new Date(hour.date) };
    const response = await this.db.collection(HOURS_COLLECTION).updateOne({ hourId }, { $set: newHour });
    return !!response.result.ok ? newHour : undefined;
  }

  async deleteHourById(hourId: string): Promise<boolean> {
    const result = await this.db.collection(HOURS_COLLECTION).deleteOne({ hourId });
    return !!result.deletedCount;
  }
}
