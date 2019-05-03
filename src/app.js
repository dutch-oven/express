import express, { Router } from 'express';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';

const makeRouter = (behaviors, asyncManager) => {
  const router = Router();
  behaviors.forEach(({endpoint, method, behavior}) => {
    router[method](endpoint, ...behavior.map(b => asyncManager(b)));
  });
  return router;
}

const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

module.exports = app;
