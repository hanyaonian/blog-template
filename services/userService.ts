import { CallbackError } from 'mongoose';
import { getSaltedPassword } from '../libs/authhelper';
import { userModel, userDocument } from '../models/user';
import crypto = require('crypto');

export default class userServices {
  public static findUser(queryKey: string): Promise<userDocument> {
    return userModel
      .findOne({
        $or: [{ userName: queryKey }, { phone: queryKey }, { email: queryKey }]
      })
      .exec() as Promise<userDocument>;
  }

  public static createUser({
    userName,
    password,
    email,
    phone
  }: Record<string, string>): Promise<userDocument | null> {
    return new Promise(async (resolve, reject) => {
      const salt: string = crypto.randomBytes(10).toString();
      const saltedPassword: string = getSaltedPassword(password, salt);
      const user: any = {
        userName,
        password: saltedPassword,
        email,
        phone,
        salt,
        lastLogin: new Date(),
        signUpDate: new Date(),
        modifiedSince: new Date()
      };
      const oldUser = await userModel
        .findOne({
          $or: [{ userName }, { phone }, { email }]
        })
        .exec();
      if (oldUser) {
        //user already exist
        resolve(null);
      } else {
        userModel.create(user, (err: CallbackError, docs: userDocument) => {
          if (err) {
            reject(err);
          } else {
            resolve(docs);
          }
        });
      }
    });
  }
}
