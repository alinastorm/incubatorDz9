import express from 'express';
import { titleBodyValidationMiddleware } from '../_common/validators/title-validation-middleware';
import { postIdParamValidationMiddleware } from '../_common/validators/postIdParam-validation-middleware';
import { contentBodyValidationMiddleware } from '../_common/validators/content-validation-middleware';
import { shortdescriptionBodyValidationMiddleware } from '../_common/validators/shortdescription-validation-middleware';
import { authorizationBasicMiddleware401 } from '../_common/validators/authBasic-validation-middleware';
import { guard400 } from '../_common/validators/guard-middleware';
import { pageNumberQueryValidationMiddleware } from '../_common/validators/pageNumber-validation-middleware';
import { pageSizeQueryValidationMiddleware } from '../_common/validators/pageSize-validation-middleware';
import { sortByPostsQueryValidationMiddleware } from '../_common/validators/sortByPosts-validation-middleware';
import { sortDirectionQueryValidationMiddleware } from '../_common/validators/sortDirection-validation-middleware';

import { commentsInputModelSchemaValidationMiddleware } from '../_common/validators/commentsInputSchema-validation-middleware';
import { sortByCommentsQueryValidationMiddleware } from '../_common/validators/sortByComments-validation-middleware';
import { authHeadersJwtMiddleware } from '../_common/validators/authHeadersJwtAccessToken-middleware';
import postsController from './posts-controller';
import { postParamIdInBDValidationMiddleware } from './validators/PostsIdParamInBD-validation-middleware';
import { blogIdBodyInBDValidationMiddleware } from '../Blogs/validators/blogIdBodyInBD-validation-middleware';

const mainRoute = 'posts'

export const postsRoutes = express.Router()


postsRoutes.get(`/posts/:postId/comments`,
    pageNumberQueryValidationMiddleware,
    pageSizeQueryValidationMiddleware,
    sortByCommentsQueryValidationMiddleware,
    sortDirectionQueryValidationMiddleware,
    guard400,
    postParamIdInBDValidationMiddleware,
    <any>postsController.getCommentsByPostIdPaginationSort)

postsRoutes.post(`/posts/:postId/comments`,
    <any>authHeadersJwtMiddleware,
    postIdParamValidationMiddleware,
    commentsInputModelSchemaValidationMiddleware,
    guard400,
    // postParamIdInBDValidationMiddleware,
    <any>postsController.createCommentsByPostId)

postsRoutes.get(`/posts`,
    pageNumberQueryValidationMiddleware,
    pageSizeQueryValidationMiddleware,
    sortByPostsQueryValidationMiddleware,
    sortDirectionQueryValidationMiddleware,
    guard400,
    <any>postsController.readAllPaginationSort)

postsRoutes.post(`/posts`,
    authorizationBasicMiddleware401,
    titleBodyValidationMiddleware,
    shortdescriptionBodyValidationMiddleware,
    contentBodyValidationMiddleware,
    blogIdBodyInBDValidationMiddleware,
    guard400,
    // bloggerBodyIdInBDValidationMiddleware,
    postsController.createOne)

postsRoutes.get(`/posts/:postId`,
    postIdParamValidationMiddleware,
    guard400,
    postParamIdInBDValidationMiddleware,
    postsController.readOne)

postsRoutes.put(`/posts/:postId`,
    authorizationBasicMiddleware401,
    postIdParamValidationMiddleware,
    titleBodyValidationMiddleware,
    shortdescriptionBodyValidationMiddleware,
    contentBodyValidationMiddleware,
    blogIdBodyInBDValidationMiddleware,
    guard400,
    postParamIdInBDValidationMiddleware,
    // bloggerBodyIdInBDValidationMiddleware,
    postsController.updateOne)

postsRoutes.delete(`/posts/:postId`,
    authorizationBasicMiddleware401,
    postIdParamValidationMiddleware,
    guard400,
    postParamIdInBDValidationMiddleware,
    postsController.deleteOne)


