import jwt = require('jsonwebtoken');
import config from '../config';
import { Middleware } from 'koa';
import { ForbiddenError } from '../libs/error';
import { userInfo } from '../libs/authhelper';

type requestHeader = {
  [propName: string]: string;
};

const jwtMiddleware: Middleware = async (ctx, next) => {
  // 将 token 中的数据解密后存到 ctx 中
  try {
    const headers = ctx.request.header as requestHeader;
    if (headers.authorization && typeof headers.authorization === 'string') {
      const token: string = headers.authorization;
      const verifyResult = jwt.verify(token, config.secret);
      ctx.jwtData = verifyResult as userInfo;
    } else {
      throw new ForbiddenError('no authorization');
    }
    /**
     *  https://github.com/ZijianHe/koa-router/issues/358
     *  after using a middleware in koa-router, we should using async await all the time
     *  since whole statck needs excute in order.
     */
    await next();
  } catch (err) {
    throw new ForbiddenError('no authorization');
  }
};

export default jwtMiddleware;
