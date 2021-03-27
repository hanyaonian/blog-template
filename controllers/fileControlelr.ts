'use strict';

import { Context, Next } from 'koa';

export default class fileController {
  public static async uploadFile(ctx: Context, next: Next): Promise<void> {
    try {
      delete ctx.file.path;
      delete ctx.file.destination;
      ctx.result = ctx.file;
      ctx.message = '上传成功';
      next();
    } catch (err) {
      throw err;
    }
  }
}
