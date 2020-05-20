import { UserRoles } from '_shared/types/types';
import { Express, Request, Response } from 'express';
import { Validator } from 'jsonschema';

import { Logger } from '../../utils/logger';
import { Auth } from '../Auth/Auth';
import { userAPISchema, userAPIUpdateSchema } from './schema';
import { UsersStore } from './Store';

export class Users {
  validator: Validator;

  constructor(private logger: Logger, private store: UsersStore, private app: Express) {
    this.validator = new Validator();

    this.app.post('/account/:accountId/users', Auth.isAuthenticated([UserRoles.admin]), this.createUser);
    this.app.get('/account/:accountId/users', Auth.isAuthenticated(), this.getUsers);
    this.app.get('/account/:accountId/users/:userId', Auth.isAuthenticated(), this.getUserById);
    this.app.put('/account/:accountId/users/:userId', Auth.isAuthenticated([UserRoles.admin]), this.updateUser);
    this.app.delete('/account/:accountId/users/:userId', Auth.isAuthenticated([UserRoles.admin]), this.deleteUser);
  }

  createUser = async (req: Request, res: Response) => {
    const validation = this.validator.validate(req.body, userAPISchema, { throwError: false });
    if (!validation.valid) {
      return res.status(400).json({ errors: validation.errors });
    }

    const { accountId } = req.params;
    const { username, password, role, workingHours } = req.body;
    const user = await this.store.createUser({ accountId, username, password, role, workingHours });
    res.status(200).send(user);
  };

  getUserById = async (req: Request, res: Response) => {
    const user = await this.store.getUserById(req.params.userId);

    if (user) {
      res.status(200).send(user);
    } else {
      res.status(404).send(user);
    }
  };

  getUsers = async (req: Request, res: Response) => {
    const users = await this.store.getUsers(req.params.accountId);

    res.send(users);
  };

  updateUser = async (req: Request, res: Response) => {
    const validation = this.validator.validate(req.body, userAPIUpdateSchema, { throwError: false });
    if (!validation.valid) {
      return res.status(400).json({ errors: validation.errors });
    }

    const { accountId, userId } = req.params;
    const user = await this.store.updateUserById(userId, { ...req.body, accountId, userId });

    if (user) {
      res.status(200).send({ ...user, password: undefined });
    } else {
      res.sendStatus(400);
    }
  };

  deleteUser = async (req: Request, res: Response) => {
    const success = await this.store.deleteUserById(req.params.userId);

    if (success) {
      res.sendStatus(200);
    } else {
      res.sendStatus(400);
    }
  };
}
