import { User, UserRoles } from '_shared/types/types';
import bcrypt from 'bcrypt';
import { Express, NextFunction, Request, Response } from 'express';
import { Validator } from 'jsonschema';
import passport from 'passport';
import LocalStrategy from 'passport-local';

import { Logger } from '../../utils/logger';
import { UsersStore } from '../Users/Store';
import { authSchema } from './schema';

export class Auth {
  private validator: Validator;

  constructor(private logger: Logger, private store: UsersStore, private app: Express) {
    this.validator = new Validator();

    this.app.use(passport.initialize());
    this.app.use(passport.session());

    passport.use(
      new LocalStrategy.Strategy(async (username, password, done) => {
        try {
          const user = await store.getUserByUsername(username.toLowerCase());
          if (!user) {
            return done(null, false, { message: 'Incorrect username.' });
          }
          if (!(await this.verifyPassword(user, password))) {
            return done(null, false, { message: 'Incorrect password.' });
          }
          return done(null, user);
        } catch (err) {
          done(err);
        }
      })
    );

    passport.serializeUser((user: User, done) => {
      return done(null, user);
    });

    passport.deserializeUser(async (user: User, done) => {
      const foundUser = !!user && (await this.store.getUserById(user.userId));
      return done(null, foundUser);
    });

    this.app.post('/register', this.register);
    this.app.post('/login', this.login);
    this.app.post('/logout', this.logout);
    this.app.get('/auth', Auth.isAuthenticated(), this.getUser);
  }

  static isAuthenticated(restrictedRoles: UserRoles[] = []) {
    return (req: Request, res: Response, next: NextFunction) => {
      if (req.isAuthenticated()) {
        const user: User = req.user as User;

        switch (user.role) {
          case UserRoles.admin:
            return next();

          case UserRoles.manager:
            if (restrictedRoles.includes(UserRoles.admin)) {
              return res.sendStatus(401);
            }
            return next();

          case UserRoles.user:
            if (req.params.userId && user.userId !== req.params.userId) {
              return res.sendStatus(401);
            }
            return next();
        }
      } else {
        return res.sendStatus(401);
      }
    };
  }

  async verifyPassword(user: User, password: string) {
    return bcrypt.compare(password, user.password || '');
  }

  register = async (req: Request, res: Response, next: NextFunction) => {
    const validation = this.validator.validate(req.body, authSchema, { throwError: false });
    if (!validation.valid) {
      return res.status(400).json({ errors: validation.errors });
    }

    const { username, password } = req.body;
    try {
      const user = await this.store.createUser({ username, password, role: UserRoles.admin });
      req.login(user, function (err) {
        if (err) {
          return next(err);
        }
        res.status(200).send(user);
      });
    } catch (e) {
      res.status(400).send({ errors: [{ stack: 'Username already taken' }] });
    }
  };

  login = (req: Request, res: Response, next: NextFunction) => {
    const validation = this.validator.validate(req.body, authSchema, { throwError: false });
    if (!validation.valid) {
      return res.status(400).json({ errors: validation.errors });
    }

    passport.authenticate('local', function (err, user) {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.status(401).send({ message: 'Either username or password are incorrect.' });
      }

      req.login(user, (err) => {
        if (err) {
          return next(err);
        }

        return res.status(200).send({ ...user, password: undefined });
      });
    })(req, res, next);
  };

  logout = async (req: Request, res: Response) => {
    req.logout();
    res.send();
  };

  getUser = async (req: Request, res: Response) => {
    const user = await this.store.getUserById((req.user as User).userId);
    if (user) {
      res.status(200).send(user);
    } else {
      res.status(404).send(user);
    }
  };
}
