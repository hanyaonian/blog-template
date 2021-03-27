import { Schema, Document } from 'mongoose';
import * as mongoose from 'mongoose';

const DOCUMENT_NAME = 'Tag';

export interface articleTag extends Document {
  name: string;
  status: number; //article status
}

const tagSchema: Schema = new Schema({
  name: String,
  status: Number //article status
});

export const TAG_DOCUMENTNAME = DOCUMENT_NAME;

/**
 * https://github.com/DefinitelyTyped/DefinitelyTyped/issues/21592
 *
 * export function model<T extends Document>(name: string, schema?: Schema<any>, collection?: string, skipInit?: boolean): Model<T>;
 */
export const tagModel = mongoose.model<articleTag>(DOCUMENT_NAME, tagSchema);
