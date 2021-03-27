import { Schema, Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { TAG_DOCUMENTNAME } from './tags';

const DOCUMENT_NAME = 'Article';

export interface article extends Document {
  title: string;
  content: string;
  tags: String[];
  summary: string;
  totalRead: number;
  lastModified: Date;
  createTime: Date;
  author: string;
  authorId: string;
  status: number; //article status
}

const ArticleSchema: Schema = new Schema({
  content: { type: String, required: true },
  title: String,
  tags: [{ type: Schema.Types.ObjectId, ref: TAG_DOCUMENTNAME }],
  summary: String,
  totalRead: Number,
  lastModified: Date,
  createTime: Date,
  author: String,
  authorId: String,
  status: Number //article status
});

export const articleModel = mongoose.model<article>(
  DOCUMENT_NAME,
  ArticleSchema
);
