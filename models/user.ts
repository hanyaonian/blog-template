import { Schema, Document } from 'mongoose';
import * as mongoose from 'mongoose';

const DOCUMENT_NAME = 'User';

export interface userDocument extends Document {
  email: string;
  userName: string;
  phone: string; //phone
  password: string;
  salt: string;
  lastLogin?: Date; //上次登录时间
  signUpDate?: Date; //注册时间
  modifiedSince?: Date; //上次修改时间
}

const UserSchema: Schema = new Schema({
  email: { type: String, required: true, trim: true, maxlength: 50 },
  userName: { type: String, required: true }, // name
  phone: String, //phone
  salt: { type: String, required: true },
  password: { type: String, required: true }, // sha256 密码
  lastLogin: Date, //上次登录时间
  signUpDate: Date, //注册时间
  modifiedSince: Date //上次修改时间
});

export const userModel = mongoose.model<userDocument>(
  DOCUMENT_NAME,
  UserSchema
);
