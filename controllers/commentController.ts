'use strict';

import { Context, Next } from 'koa';
import commentService from '../services/commentService';
import * as captcha from 'svg-captcha';
import { InvalidQueryError, UnexpectedError } from '../libs/error';
import { isDef } from '../libs/util';
import wordMatchHelper from 'word-match-helper';
import { dirtywordList } from '../assets/ditrywordList';
import { comment } from '../models/comment';
// todo: find dirty word source
const wordMatcher = new wordMatchHelper(dirtywordList);

export default class commentController {
  public static async getRandomCaptch(ctx: Context, next: Next): Promise<void> {
    try {
      const svgCaptcha = captcha.create({
        height: 40,
        width: 120
      });
      ctx.append('captcha', svgCaptcha.text);
      ctx.type = 'svg';
      ctx.result = svgCaptcha.data;
      next();
    } catch (err) {
      throw err;
    }
  }

  public static async queryCommentList(ctx: Context, next: Next) {
    try {
      // @ts-ignore
      const {
        pageSize = 10,
        pageNum = 1
      }: { pageSize: number; pageNum: number } = ctx.request.query;
      const commentList = await commentService.getCommentList(
        ~~pageSize,
        ~~pageNum
      );
      const totalCount = await commentService.getCommentCount();
      ctx.result = {
        page: pageNum,
        pageSize,
        records: commentList,
        total: totalCount,
        totalPages: ~~(totalCount / pageSize) + 1
      };
      ctx.message = '查询成功';
      next();
    } catch (err) {
      throw new UnexpectedError('评论查询失败');
    }
  }

  private static filterSensitiveMesssage(commentList: comment[]): any[] {
    return commentList.map((comment) => {
      return {
        commentList: commentController.filterSensitiveMesssage(
          comment.commentList as comment[]
        ),
        _id: comment._id,
        userName: comment.userName,
        personalSite: comment.personalSite,
        content: comment.content,
        createDate: comment.createDate
      };
    });
  }

  public static async getCommentByArticle(ctx: Context, next: Next) {
    try {
      // @ts-ignore
      const { articleId }: { articleId: string } = ctx.request.query;
      if (!isDef(articleId)) {
        throw new InvalidQueryError('参数不完整');
      }
      const commentList = await commentService.getCommentByArticleId(articleId);
      ctx.result = commentController.filterSensitiveMesssage(commentList);
      ctx.message = '查询成功';
      next();
    } catch (err) {
      throw err;
    }
  }

  public static async deleteCommentById(ctx: Context, next: Next) {
    try {
      const { id } = ctx.request.body;
      if (!isDef(id)) {
        throw new InvalidQueryError('参数不完整');
      }
      const result = await commentService.deleteComment(id);
      ctx.result = result;
      ctx.message = result ? '删除成功' : '删除失败';
      next();
    } catch (err) {
      throw err;
    }
  }

  public static async createComment(ctx: Context, next: Next) {
    try {
      const { comment } = ctx.request.body;
      if (!isDef(comment) || !isDef(comment.content)) {
        throw new InvalidQueryError('参数不完整');
      }
      const [firstDirtyWord] = wordMatcher.search(comment.content);
      if (isDef(firstDirtyWord)) {
        throw new InvalidQueryError(
          `内容粗俗，于第${firstDirtyWord.pos}字符附近包含 ${firstDirtyWord.word}`
        );
      }
      comment.createDate = new Date();
      const createResult = await commentService.createComment(comment);
      ctx.result = createResult;
      ctx.message = createResult ? '创建成功' : '创建失败';
      next();
    } catch (err) {
      throw err;
    }
  }
}
