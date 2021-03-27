import * as Koa from 'koa';
import * as bodyParser from 'koa-bodyparser';
import * as staticCache from 'koa-static-cache';
import * as koaCors from 'koa2-cors';
import * as helmet from 'koa-helmet';
import { connectToDB } from './libs/database';
import appConfig from './config';
import { publicRouter, publicRouteMethods } from './routes/public';
import { privateRouter, privateRouterMethods } from './routes/private';
import corsHandler from './middlewares/cors';
import { loggerMiddleware } from './middlewares/logger';
import { errorHandler, responseHandler } from './middlewares/response';

//starting koa
const koaApp = new Koa();

// Logger
koaApp.use(loggerMiddleware);
//cros & safety
koaApp.use(koaCors(corsHandler));
koaApp.use(helmet());
// Error Handler
koaApp.use(errorHandler);

// Global Middlewares
koaApp.use(bodyParser());
koaApp.use(staticCache(appConfig.publicDir, appConfig.fileConfig));

// Routes
koaApp.use(privateRouter);
koaApp.use(privateRouterMethods);
koaApp.use(publicRouter);
koaApp.use(publicRouteMethods);

// Response
koaApp.use(responseHandler);

connectToDB()
  .then(() => {
    koaApp.listen(appConfig.port);
  })
  .catch((err) => {
    console.log(err);
  });
