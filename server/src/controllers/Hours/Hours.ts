import { Express, Request, Response } from 'express';
import { Validator } from 'jsonschema';

import { Logger } from '../../utils/logger';
import { Auth } from '../Auth/Auth';
import { hoursAPISchema } from './schema';
import { HoursStore } from './Store';

export class Hours {
  validator: Validator;

  constructor(private logger: Logger, private store: HoursStore, private app: Express) {
    this.validator = new Validator();

    this.app.post('/account/:accountId/users/:userId/hours', Auth.isAuthenticated(), this.createHour);
    this.app.get('/account/:accountId/users/:userId/hours', Auth.isAuthenticated(), this.getHours);
    this.app.put('/account/:accountId/users/:userId/hours/:hourId', Auth.isAuthenticated(), this.updateHour);
    this.app.delete('/account/:accountId/users/:userId/hours/:hourId', Auth.isAuthenticated(), this.deleteHour);
  }

  createHour = async (req: Request, res: Response) => {
    const validation = this.validator.validate(req.body, hoursAPISchema, { throwError: false });
    if (!validation.valid) {
      return res.status(400).json({ errors: validation.errors });
    }

    const { accountId, userId } = req.params;
    const hour = await this.store.createHour({ ...req.body, accountId, userId });

    res.json(hour);
  };

  getHours = async (req: Request, res: Response) => {
    const hours = await this.store.getHours(req.params.userId, req.query);

    res.json(hours);
  };

  updateHour = async (req: Request, res: Response) => {
    const validation = this.validator.validate(req.body, hoursAPISchema, { throwError: false });
    if (!validation.valid) {
      return res.status(400).json({ errors: validation.errors });
    }

    const { accountId, userId, hourId } = req.params;
    const hour = await this.store.updateHourById(hourId, { ...req.body, accountId, userId, hourId });

    if (hour) {
      res.json(hour);
    } else {
      res.sendStatus(400);
    }
  };

  deleteHour = async (req: Request, res: Response) => {
    const success = await this.store.deleteHourById(req.params.hourId);

    if (success) {
      res.sendStatus(200);
    } else {
      res.sendStatus(400);
    }
  };
}
