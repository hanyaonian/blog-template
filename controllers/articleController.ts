import { Context, Middleware, Next } from 'koa';
import { article } from '../models/article';
import { checkInvalidKey } from '../libs/util';
import {
  InvalidQueryError,
  UnexpectedError,
  unAuthorized,
  CodedError,
  resourceNotFound
} from '../libs/error';
import articleService from '../services/articleService';
import { ARTICLE_STATUS } from '../libs/status';

export default class articleController {
  public static async createNewPost(ctx: Context, next: Next): Promise<void> {
    if (!checkInvalidKey(ctx.request, ['content', 'tag', 'title', 'summary'])) {
      throw new InvalidQueryError('文章参数不完整');
    }
    try {
      const { content, tag, summary, title } = ctx.request.body;
      const userData = ctx.jwtData;
      if (!userData || Object.keys(userData).length === 0) {
        throw new unAuthorized('用户信息错误');
      }
      const tags = await articleService.createTagsByTagName(tag);
      const tagsIds = tags.map((tag) => tag._id);
      const newArticle = {
        title,
        content,
        tags: tagsIds,
        summary,
        totalRead: 0,
        lastModified: new Date(),
        createTime: new Date(),
        author: userData.data.userName,
        authorId: userData.data.userId,
        status: ARTICLE_STATUS.PUBLISHED //article status
      } as article;
      console.log(userData);
      let createResult = await articleService.createArticle(newArticle);
      if (createResult) {
        ctx.message = '创建成功';
        ctx.result = true;
        next();
      }
    } catch (err) {
      if (err instanceof CodedError) {
        throw err;
      } else {
        throw new UnexpectedError('创建失败');
      }
    }
  }

  public static async getAllTags(ctx: Context, next: Next) {
    try {
      const tags = await articleService.getAllTags();
      ctx.result = tags || [];
      ctx.message = '查询标签成功';
      next();
    } catch (err) {
      throw new UnexpectedError('查询标签失败');
    }
  }

  public static async queryArticleByTag(ctx: Context, next: Next) {
    try {
      // @ts-ignore
      const {
        pageSize = 10,
        pageNum = 1,
        tagId = ''
      }: {
        pageSize: number;
        pageNum: number;
        tagId: string;
      } = ctx.request.query;
      const articles =
        (await articleService.getArticleByPagesOrTag(
          ~~pageSize,
          ~~pageNum,
          tagId
        )) || [];
      const resizingArticles = articles.map((val) => {
        return {
          _id: val._id,
          title: val.title,
          author: val.author,
          createTime: val.createTime,
          summary: val.summary,
          totalRead: val.totalRead,
          tags: val.tags
        };
      });
      const totalCount = await articleService.getArticleCount(tagId);
      ctx.result = {
        page: pageNum,
        pageSize,
        records: resizingArticles,
        total: totalCount,
        totalPages: ~~(totalCount / 10) + 1
      };
      ctx.message = '查询成功';
      next();
    } catch (err) {
      throw new UnexpectedError('文章查询失败');
    }
  }

  public static async deleteArticleById(ctx: Context, next: Next) {
    try {
      if (!checkInvalidKey(ctx.request, ['id'])) {
        throw new InvalidQueryError('缺少参数');
      }
      const { id } = ctx.request.body;
      const result = await articleService.removeArticleById(id);
      ctx.message = result ? '移除成功' : '移除失败';
      ctx.result = result;
      next();
    } catch (err) {
      throw new UnexpectedError('删除文章失败');
    }
  }

  public static async getArticleById(ctx: Context, next: Next) {
    try {
      const { id } = ctx.request.query as { id: string };
      if (!id) {
        throw new InvalidQueryError('缺少参数');
      }
      const result = await articleService.getArticleById(id);
      if (result) {
        ctx.result = result;
        ctx.message = '查询成功';
        next();
      } else {
        throw new resourceNotFound('文章查询失败');
      }
    } catch (err) {
      throw new UnexpectedError('文章查询失败');
    }
  }
}
