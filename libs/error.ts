'use strict';

export class CodedError extends Error {
  code: number;
  constructor(message = 'Unknow Error', code = -1) {
    super(message);
    this.code = code;
  }
}

/**
 * Access Denied
 */
export class ForbiddenError extends CodedError {
  constructor(message = 'Access denied') {
    super(message, 403);
  }
}
/**
 * Resource Not found
 */
export class resourceNotFound extends CodedError {
  constructor(message = 'resource not found') {
    super(message, 404);
  }
}
/**
 * Params Invalid
 */
export class InvalidQueryError extends CodedError {
  constructor(message = 'Unvalid Params') {
    super(message, 400);
  }
}

/**
 * Normal error
 */
export class unAuthorized extends CodedError {
  constructor(message = 'Input Error') {
    super(message, 401);
  }
}

/**
 * Unexpected Error
 */
export class UnexpectedError extends CodedError {
  constructor(message = 'Internal Error') {
    super(message, 500);
  }
}
