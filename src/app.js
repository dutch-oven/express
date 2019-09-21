import express, { Router } from 'express';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import helmet from 'helmet';

import logger from './util/logger';
import errorHandler from './util/errorHandler';
import asyncManager from './util/asyncManager';

import boundary from './util/boundary';
import entityMap from './util/entityMap';
import messageHandler from './util/messageHandler';

import resources from './resources';

const makeRouter = (behaviors = [], asyncManager = () => {}, middlewares=[]) => {
  const router = Router();

  middlewares.forEach(middleware => {
    router.use(middleware);
  });

  behaviors.forEach(({endpoint, method, behavior}) => {
    router[method](endpoint, ...behavior.map(b => asyncManager(b)));
  });

  return router;
}

const makeApp = ({entityConfig, messageConfig, ...config} = {}) => {
  const app = express();

  app.set('trust proxy', true);

  app.use(helmet());
  app.use(morgan('combined', { stream: logger.stream }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());

  resources(
    {
      config,
      logger,
      boundary,
      messageHandler: messageConfig ? messageHandler(messageConfig) : messageHandler,
      entityMapper: entityConfig ? entityMap(entityConfig) : entityMap
    }
  ).forEach(({ resource, behaviors, middlewares }) =>
    app.use(resource, makeRouter(behaviors, asyncManager, middlewares)));

  app.use('*', (req, res, next) => next({status: 404}));
  app.use(errorHandler(logger));

  return app;
};

export default makeApp;