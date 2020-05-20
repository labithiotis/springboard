import { Schema } from 'jsonschema';

export const authSchema: Schema = {
  title: 'User',
  type: 'object',
  additionalProperties: false,
  required: ['username', 'password'],
  properties: {
    username: {
      type: 'string',
      minLength: 3,
    },
    password: {
      title: 'Password',
      type: 'string',
      minLength: 7,
    },
  },
};
