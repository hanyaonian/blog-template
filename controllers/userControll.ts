'use strict';

import { Context, Next } from 'koa';
import userServices from '../services/userService';
import { makeAuth, checkPassword } from '../libs/authhelper';
import {
  InvalidQueryError,
  unAuthorized,
  resourceNotFound,
  CodedError
} from '../libs/error';
import { checkInvalidKey } from '../libs/util';

type requestBody = {
  [propName: string]: string;
};

export default class userController {
  public static async login(ctx: Context, next: Next): Promise<void> {
    if (!checkInvalidKey(ctx.request, ['queryKey', 'password'])) {
      throw new InvalidQueryError();
    }
    const { queryKey, password } = ctx.request.body as requestBody;
    try {
      const user = await userServices.findUser(queryKey);
      if (!user) {
        throw new resourceNotFound('用户不存在');
      }
      const verified = checkPassword(password, user.password, user.salt);
      if (verified) {
        Object.assign(ctx, {
          result: makeAuth({
            userId: user._id,
            userName: user.userName
          }),
          message: '登录成功'
        });
        next();
      } else {
        throw new unAuthorized('用户名或密码错误');
      }
    } catch (err) {
      throw err;
    }
  }

  public static async signup(ctx: Context, next: Next): Promise<void> {
    if (
      !checkInvalidKey(ctx.request, ['userName', 'password', 'phone', 'email'])
    ) {
      throw new InvalidQueryError();
    }
    const { userName, password, phone, email } = ctx.request
      .body as requestBody;
    if (userName !== 'michael') {
      // 你也可以通过mongo命令行插入用户并屏蔽signup接口
      throw new InvalidQueryError('呵呵，博客是我的');
    }
    try {
      const user = await userServices.createUser({
        userName: userName,
        password: password,
        phone: phone,
        email: email
      });
      if (user) {
        Object.assign(ctx, {
          result: makeAuth(user._id),
          message: '注册接口访问成功'
        });
      } else {
        throw new CodedError('用户已存在', 409);
      }
    } catch (err) {
      throw err;
    }
    next();
  }
}
