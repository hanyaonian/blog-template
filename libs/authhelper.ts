import serverConfig from '../config';
import * as jwt from 'jsonwebtoken';
import crypto = require('crypto');

export type userInfo = {
  userName: string;
  userId: string;
};

export const makeAuth = (user: userInfo): string => {
  const jwtConfig = {
    data: user,
    // 设置 token 过期时间
    exp: Math.floor(Date.now() / 1000) + 60 * 60 // 60 seconds * 60 minutes = 1 hour
  };
  return jwt.sign(jwtConfig, serverConfig.secret);
};

export const checkPassword = (
  password: string,
  userPassword: string,
  salt: string
): boolean => {
  const saltedPassword: string = getSaltedPassword(password, salt);
  return saltedPassword === userPassword;
};

/**
 * @param password password
 * @param salt salt
 * @return hashed password
 */
export function getSaltedPassword(password: string, salt: string) {
  const saltedPassword: string = crypto
    .createHash(serverConfig.hashMethod)
    .update(`${password}${salt}`)
    .digest('hex');
  return saltedPassword;
}
