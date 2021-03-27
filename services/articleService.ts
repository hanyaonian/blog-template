import { STATUS, ARTICLE_STATUS } from '../libs/status';
import { articleModel, article } from '../models/article';
import { articleTag, tagModel } from '../models/tags';

export default class userServices {
  public static async createArticle(articleParam: article): Promise<boolean> {
    try {
      const createResponse = await articleModel.create(articleParam);
      return Boolean(createResponse);
    } catch (err) {
      throw err;
    }
  }

  public static async createTagsByTagName(
    tags: string[]
  ): Promise<articleTag[]> {
    try {
      let newTags: string[];
      let existDocs = await tagModel.find().where('name').in(tags).exec();
      if (existDocs && existDocs.length) {
        const passedSet = new Set(tags);
        const existSet = new Set(existDocs.map((val: articleTag) => val.name));
        const newTagsSet = new Set(
          [...passedSet].filter((existTag) => !existSet.has(existTag))
        );
        newTags = [...newTagsSet];
      } else {
        newTags = tags;
      }
      let docs = await tagModel.insertMany(
        newTags.map((tag: string) => {
          return {
            name: tag,
            status: STATUS.ACTIVE
          };
        })
      );
      return existDocs ? docs.concat(existDocs) : docs;
    } catch (err) {
      throw err;
    }
  }

  public static async getAllTags(): Promise<articleTag[] | null> {
    try {
      let allTags = await tagModel.find({ status: STATUS.ACTIVE });
      if (allTags && allTags.length) {
        return allTags;
      } else {
        return null;
      }
    } catch (err) {
      throw err;
    }
  }

  public static async getArticleByPagesOrTag(
    pageSize: number,
    pageNum: number,
    tagId?: string
  ): Promise<article[] | null> {
    try {
      const query = tagId ? { tags: tagId } : {};
      let targetArticle = await articleModel
        .find({ ...query, status: ARTICLE_STATUS.PUBLISHED })
        .sort({ createTime: -1 })
        .limit(pageSize)
        .skip(pageSize * (pageNum - 1))
        .populate('tags');
      return targetArticle || [];
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  public static async getArticleCount(tagId: string): Promise<number> {
    try {
      const query = tagId ? { tags: tagId } : {};
      let totalCount = await articleModel.count({
        ...query,
        status: ARTICLE_STATUS.PUBLISHED
      });
      return totalCount || 0;
    } catch (err) {
      throw err;
    }
  }
  //   public static async searchArticleByTags(tags)

  public static async removeArticleById(id: string): Promise<boolean> {
    try {
      const result = await articleModel.findOneAndUpdate(
        { _id: id },
        {
          status: ARTICLE_STATUS.DELETED
        }
      );
      return Boolean(result);
    } catch (err) {
      throw err;
    }
  }

  public static async getArticleById(id: string): Promise<article | null> {
    try {
      const result = await articleModel.findById(id).populate('tags');
      if (result) {
        await articleModel.findOneAndUpdate(
          { _id: id },
          { totalRead: result.totalRead + 1 }
        );
      }
      return result;
    } catch (err) {
      throw err;
    }
  }
}
