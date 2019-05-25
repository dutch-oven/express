import express, { Router } from 'express';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import helmet from 'helmet';
import csrf from 'csurf';

const makeRouter = (behaviors, asyncManager) => {
  const router = Router();
  behaviors.forEach(({endpoint, method, behavior}) => {
    router[method](endpoint, ...behavior.map(b => asyncManager(b)));
  });
  return router;
}

const makeApp = config => {
  const app = express();

  app.use(helmet());
  app.use(morgan('dev'));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(csrf());

  return app;
};

module.exports = makeApp;
