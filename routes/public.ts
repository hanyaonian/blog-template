'use strict';

import * as Router from 'koa-router';
import articleController from '../controllers/articleController';
import userController from '../controllers/userControll';
import commentController from '../controllers/commentController';

const router = new Router();
router.prefix('/public');
router.post('/login', userController.login);
router.post('/signup', userController.signup);
router.get('/getAllTags', articleController.getAllTags);
router.get('/getArticles', articleController.queryArticleByTag);
router.get('/getArticleById', articleController.getArticleById);
router.get('/getRandomCaptcha', commentController.getRandomCaptch);
router.post('/createComment', commentController.createComment);
router.get('/getCommentByArticle', commentController.getCommentByArticle);

export const publicRouter = router.routes();
export const publicRouteMethods = router.allowedMethods();
