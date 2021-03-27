import { Schema, Document } from 'mongoose';
import * as mongoose from 'mongoose';

const DOCUMENT_NAME = 'Comment';

export const COMMENT_DOCUMENTNAME = DOCUMENT_NAME;

export interface comment extends Document {
  userName: string;
  personalSite?: string;
  attachArticleId: string;
  commentList: string[] | comment[];
  email?: string; //can be deleted
  content: string;
  status: number;
  createDate: Date;
  replyCommentId?: string;
}

const commentSchema: Schema = new Schema({
  userName: { type: String, required: true, trim: true, maxlength: 50 },
  personalSite: String,
  attachArticleId: String,
  commentList: [{ type: Schema.Types.ObjectId, ref: COMMENT_DOCUMENTNAME }],
  email: { type: String, required: true, trim: true },
  content: { type: String, required: true, trim: true },
  status: Number,
  createDate: Date,
  replyCommentId: String
});

export const commentModel = mongoose.model<comment>(
  DOCUMENT_NAME,
  commentSchema
);
