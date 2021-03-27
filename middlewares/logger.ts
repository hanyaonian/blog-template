import * as fs from 'fs';
import * as path from 'path';
import * as log4js from 'log4js';
import config from '../config';
import { Context, Middleware } from 'koa';

const logsDir = path.parse(config.logPath).dir;
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}
// 配置log4.js
log4js.configure({
  appenders: {
    console: { type: 'console' },
    dateFile: {
      type: 'dateFile',
      filename: config.logPath,
      pattern: '-yyyy-MM-dd'
    }
  },
  categories: {
    default: {
      appenders: ['console', 'dateFile'],
      level: 'info'
    }
  }
});

export const logger = log4js.getLogger('[Default]');
// logger中间件
export const loggerMiddleware: Middleware = async (ctx: Context, next) => {
  // 请求开始时间
  const startTime: number = new Date().getTime();
  await next();
  // 结束时间
  const endTime: number = new Date().getTime() - startTime;
  // 打印出请求相关参数
  const remoteAddress: string = ctx.ip;
  const logText = `${ctx.method} ${ctx.status} ${
    ctx.url
  } request-body: ${JSON.stringify(
    ctx.request.body
  )} response-body: ${JSON.stringify(
    ctx.body
  )} - ${remoteAddress} - ${endTime}ms`;
  if (ctx.status !== 200 || endTime > 100) {
    // only record failed and slow request
    logger.info(logText);
  }
};
