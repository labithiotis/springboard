export enum UserRoles {
  user = 'user',
  manager = 'manager',
  admin = 'admin',
}

export type User = {
  userId: string;
  accountId: string;
  username: string;
  password?: string;
  workingHours: number;
  role: UserRoles;
};

export type Hour = {
  userId: string;
  accountId: string;
  hourId: string;
  date: Date;
  hours: number;
  notes: string;
};
