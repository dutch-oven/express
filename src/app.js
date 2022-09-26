import express, { Router } from 'express';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';

import logger from './util/logger.js';
import errorHandler from './util/errorHandler.js';
import asyncManager from './util/asyncManager.js';

import boundary from './util/boundary.js';
import entityMap from './util/entityMap.js';
import messageHandler from './util/messageHandler.js';
import cacheHandler from "./util/cacheHandler.js";

import resources from './resources/index.js';

import { monotonicFactory } from 'ulid';

const ulid = monotonicFactory()

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

const makeApp = ({
    crossOrigin,
    entityConfig,
    messageConfig,
    cacheConfig,
    ...config
  } = {}) => {

  const app = express();

  app.set('trust proxy', true);

  if(crossOrigin) app.use(cors())

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
      cacheHandler: cacheConfig ? cacheHandler(cacheConfig) : cacheHandler,
      idManager: {getId: ulid}, // all resources share a monotonicFactory ?
      entityMapper: entityConfig ? entityMap(entityConfig) : entityMap
    }
  ).forEach(({ resource, behaviors, middlewares }) =>
    app.use(resource, makeRouter(behaviors, asyncManager, middlewares)));

  app.use('*', (req, res, next) => next({status: 404}));
  app.use(errorHandler(logger));

  return app;
};

export default makeApp;