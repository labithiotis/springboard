import { Hour, User, UserRoles } from '../types/types';
import { randomNumber, randomString } from '../utils/random';

export function mockUser(user: Partial<User> = {}): User {
  return {
    userId: randomString(),
    accountId: randomString(),
    username: randomString(),
    password: randomString(),
    role: UserRoles.user,
    workingHours: 9,
    ...user,
  };
}

export function mockHour(user: Partial<Hour> = {}): Hour {
  return {
    userId: randomString(),
    accountId: randomString(),
    hourId: randomString(),
    date: new Date(randomNumber(0, Date.now())),
    hours: 9,
    notes: randomString(),
    ...user,
  };
}
