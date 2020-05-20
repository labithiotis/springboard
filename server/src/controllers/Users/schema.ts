import { UserRoles } from '_shared/types/types';
import { Schema } from 'jsonschema';

export const userDatabaseSchema: Schema = {
  type: 'object',
  required: ['accountId', 'userId', 'username', 'password', 'role', 'workingHours'],
  properties: {
    accountId: {
      type: 'string',
    },
    userId: {
      type: 'string',
    },
    username: {
      type: 'string',
      minLength: 3,
    },
    password: {
      type: 'string',
    },
    workingHours: {
      type: 'number',
      minimum: 1,
      maximum: 24,
    },
    role: {
      enum: Object.values(UserRoles),
    },
  },
};

export const userAPISchema: Schema = {
  title: 'User',
  type: 'object',
  additionalProperties: false,
  required: ['username', 'password', 'role', 'workingHours'],
  properties: {
    accountId: {
      type: 'string',
    },
    userId: {
      type: 'string',
    },
    username: {
      title: 'Username',
      type: 'string',
      minLength: 3,
    },
    password: {
      title: 'Password',
      type: 'string',
      minLength: 7,
    },
    role: {
      type: 'string',
      enum: Object.values(UserRoles),
    },
    workingHours: {
      title: 'Working Hours',
      type: 'number',
      minimum: 1,
      maximum: 24,
    },
  },
};

export const userAPIUpdateSchema: Schema = {
  ...userAPISchema,
  required: ['username', 'role', 'workingHours'],
};
