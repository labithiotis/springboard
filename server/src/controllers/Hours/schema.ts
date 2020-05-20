import { Schema } from 'jsonschema';

export const hoursDatabaseSchema: Schema = {
  type: 'object',
  required: ['accountId', 'userId', 'hourId', 'date', 'hours', 'notes'],
  properties: {
    accountId: {
      type: 'string',
    },
    userId: {
      type: 'string',
    },
    hourId: {
      type: 'string',
    },
    hours: {
      type: 'number',
      minimum: 1,
      maximum: 24,
    },
    notes: {
      type: 'string',
    },
  },
};

export const hoursAPISchema: Schema = {
  title: 'Hours',
  type: 'object',
  additionalProperties: false,
  required: ['date', 'hours', 'notes'],
  properties: {
    accountId: {
      type: 'string',
    },
    userId: {
      type: 'string',
    },
    hourId: {
      type: 'string',
    },
    date: {
      title: 'Date',
      type: 'string',
      format: 'date-time',
    },
    hours: {
      title: 'Hours',
      type: 'integer',
      minimum: 1,
      maximum: 24,
    },
    notes: {
      title: 'Notes',
      type: 'string',
    },
  },
};
