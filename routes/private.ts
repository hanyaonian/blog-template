'use strict';

import * as Router from 'koa-router';
//内部路由接口需要有token验证
import jwtMiddleware from '../middlewares/jwt';
import { errorHandler } from '../middlewares/response';
import upload from '../libs/fileHandler';
import fileController from '../controllers/fileControlelr';
import articleController from '../controllers/articleController';
import commentController from '../controllers/commentController';

const router = new Router();
router.prefix('/api');
router.use(jwtMiddleware);
//TODO: 研究一下为什么koa-router使用了jwtMiddleware之后无法用到errorHandler这个中间件
//看了源码明白了：
//router的中间件又多了一层，因此捕获不到这里面controller输出的错误，所以nodejs挂了
router.use(errorHandler);
router.post('/createPost', articleController.createNewPost);
router.post('/removeArticleById', articleController.deleteArticleById);
router.post('/uploadFile', upload.single('file'), fileController.uploadFile);
router.get('/getCommentList', commentController.queryCommentList);
router.post('/deleteCommentById', commentController.deleteCommentById);

export const privateRouter = router.routes();
export const privateRouterMethods = router.allowedMethods();
