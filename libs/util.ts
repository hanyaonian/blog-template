import { Request } from 'koa';

export const checkInvalidKey = (request: Request, keys: string[]): boolean => {
  const requestBody = request.body;
  if (!requestBody) {
    return false;
  }
  return keys.every((key) => requestBody[key]);
};

export function isDef(target: any): Boolean {
  return target !== undefined && target !== null;
}
