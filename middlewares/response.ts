import { Context, Middleware, Next } from 'koa';
import { logger } from './logger';
import { isDef } from '../libs/util';

export interface respondBody {
  message?: string;
  data?: unknown;
}

export const responseHandler: Middleware = async (
  ctx: Context,
  next: Next
): Promise<void> => {
  if (!isDef(ctx.result)) {
    return;
  }
  if (ctx.type) {
    ctx.body = ctx.result;
  } else {
    const res: respondBody = {
      message: ctx.message || 'success',
      data: ctx.result
    };
    ctx.response.body = res;
  }
  // response is the last middleware
  next();
};

// 这个middleware处理在其它middleware中出现的异常,我们在next()后面进行异常捕获，出现异常直接进入这个中间件进行处理
export const errorHandler: Middleware = async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    console.log(err);
    //uncatched error
    if (!err.code) {
      ctx.status = 500;
      logger.error(err.stack);
    } else {
      ctx.status = err.code;
      ctx.body = {
        data: null,
        message: err.message
      };
    }
  }
};
