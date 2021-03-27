import { commentModel, comment } from '../models/comment';
import { STATUS } from '../libs/status';
import { isDef } from '../libs/util';

export default class userServices {
  public static getCommentByArticleId(articleId: string): Promise<comment[]> {
    // origin comment without list
    return commentModel
      .find({
        status: STATUS.ACTIVE,
        attachArticleId: articleId,
        replyCommentId: {
          $exists: false
        }
      })
      .populate({
        path: 'commentList',
        populate: {
          path: 'commentList'
        }
      })
      .exec();
  }

  public static async getCommentList(
    pageSize: number,
    pageNum: number
  ): Promise<comment[]> {
    try {
      // origin comment without list
      let commentList = await commentModel
        .find({ status: STATUS.ACTIVE })
        .sort({ createTime: -1 })
        .limit(pageSize)
        .skip(pageSize * (pageNum - 1))
        .populate({
          path: 'commentList',
          populate: {
            path: 'commentList'
          }
        })
        .exec();
      return commentList || [];
    } catch (err) {
      throw err;
    }
  }

  public static async createComment(newComment: comment): Promise<boolean> {
    try {
      // origin comment without list
      let result = await commentModel.create({
        ...newComment,
        status: STATUS.ACTIVE
      });
      if (isDef(newComment.replyCommentId)) {
        await commentModel.updateOne(
          { _id: newComment.replyCommentId },
          { $push: { commentList: result._id } }
        );
      }
      return Boolean(result);
    } catch (err) {
      throw err;
    }
  }

  public static async deleteComment(id: string): Promise<boolean> {
    try {
      const result = await commentModel.updateOne(
        { _id: id },
        { status: STATUS.DELETED }
      );
      return Boolean(result);
    } catch (err) {
      throw err;
    }
  }

  public static async getCommentCount(): Promise<number> {
    try {
      const total = await commentModel.count({ status: STATUS.ACTIVE });
      return total;
    } catch (err) {
      throw err;
    }
  }
}
