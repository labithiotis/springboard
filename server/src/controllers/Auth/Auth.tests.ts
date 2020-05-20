import { mockUser } from '_shared/mocks/users';
import { UserRoles } from '_shared/types/types';
import { randomString } from '_shared/utils/random';
import { Request, Response } from 'express';

import { Auth } from './Auth';

describe('Auth', () => {
  describe('isAuthenticated', () => {
    it('calls next if request is for desired user', async () => {
      const userId = randomString();
      const isAuthenticated = jest.fn(() => true);
      const sendStatus = jest.fn();
      const next = jest.fn();

      const req = mockRequest({
        params: { userId },
        user: mockUser({ userId, role: UserRoles.user }),
        isAuthenticated,
      });
      const res = mockResponse({
        sendStatus,
      });

      await Auth.isAuthenticated()(req, res, next);

      expect(next).toBeCalled();
    });

    it('sets status to 401 if request is not for same user', async () => {
      const userId = randomString();
      const isAuthenticated = jest.fn(() => true);
      const sendStatus = jest.fn();
      const next = jest.fn();

      const req = mockRequest({
        params: { userId: 'OTHER_USER_ID' },
        user: mockUser({ userId, role: UserRoles.user }),
        isAuthenticated,
      });
      const res = mockResponse({
        sendStatus,
      });

      await Auth.isAuthenticated()(req, res, next);

      expect(next).not.toBeCalled();
      expect(sendStatus).toBeCalledWith(401);
    });

    it('calls next if there is a user and has manager role', async () => {
      const userId = randomString();
      const isAuthenticated = jest.fn(() => true);
      const sendStatus = jest.fn();
      const next = jest.fn();

      const req = mockRequest({
        params: { userId: 'OTHER_USER_ID' },
        user: mockUser({ userId, role: UserRoles.manager }),
        isAuthenticated,
      });
      const res = mockResponse({
        sendStatus,
      });

      await Auth.isAuthenticated()(req, res, next);

      expect(next).toBeCalled();
    });

    it('calls next if there is a user and has admin role', async () => {
      const userId = randomString();
      const isAuthenticated = jest.fn(() => true);
      const sendStatus = jest.fn();
      const next = jest.fn();

      const req = mockRequest({
        params: { userId: 'OTHER_USER_ID' },
        user: mockUser({ userId, role: UserRoles.admin }),
        isAuthenticated,
      });
      const res = mockResponse({
        sendStatus,
      });

      await Auth.isAuthenticated()(req, res, next);

      expect(next).toBeCalled();
    });

    it('sets status to 401 if request is unauthenticated', async () => {
      const userId = randomString();
      const isAuthenticated = jest.fn(() => false);
      const sendStatus = jest.fn();
      const next = jest.fn();

      const req = mockRequest({
        params: { userId },
        user: mockUser({ userId, role: UserRoles.admin }),
        isAuthenticated,
      });
      const res = mockResponse({
        sendStatus,
      });

      await Auth.isAuthenticated()(req, res, next);

      expect(next).not.toBeCalled();
      expect(sendStatus).toBeCalledWith(401);
    });
  });

  describe('isAdmin', () => {
    it('only allows request if user is admin', async () => {
      const isAuthenticated = jest.fn(() => true);
      const sendStatus = jest.fn();
      const next = jest.fn();

      const req = mockRequest({
        user: mockUser({ role: UserRoles.admin }),
        isAuthenticated,
      });
      const res = mockResponse({
        sendStatus,
      });

      await Auth.isAuthenticated([UserRoles.admin])(req, res, next);

      expect(next).toBeCalled();
    });

    it('sets status to 401 if user is has role user and requesting not its self', async () => {
      const isAuthenticated = jest.fn(() => true);
      const sendStatus = jest.fn();
      const next = jest.fn();

      const req = mockRequest({
        user: mockUser({ userId: randomString(), role: UserRoles.user }),
        isAuthenticated,
        params: { userId: randomString() }
      });
      const res = mockResponse({
        sendStatus,
      });

      await Auth.isAuthenticated([UserRoles.admin])(req, res, next);

      expect(next).not.toBeCalled();
      expect(sendStatus).toBeCalledWith(401);
    });

    it('sets status to 401 if user is manager', async () => {
      const isAuthenticated = jest.fn(() => true);
      const sendStatus = jest.fn();
      const next = jest.fn();

      const req = mockRequest({
        user: mockUser({ role: UserRoles.manager }),
        isAuthenticated,
      });
      const res = mockResponse({
        sendStatus,
      });

      await Auth.isAuthenticated([UserRoles.admin])(req, res, next);

      expect(next).not.toBeCalled();
      expect(sendStatus).toBeCalledWith(401);
    });
  });
});

function mockRequest(req: any): Request {
  return {
    user: undefined,
    params: {},
    isAuthenticated: jest.fn(),
    ...req,
  } as any;
}

function mockResponse(res: any): Response {
  const response = {
    send: jest.fn(() => response),
    json: jest.fn(() => response),
    status: jest.fn(() => response),
    sendStatus: jest.fn(() => response),
    ...res,
  } as any;

  return response;
}
