import express from 'express';
import { nameBodyValidationMiddleware } from '../_common/validators/name-validation-middleware';
import { youtubeUrlBodyValidationMiddleware } from '../_common/validators/youtubeUrl-validation-middleware';
import { authorizationBasicMiddleware401 } from '../_common/validators/authBasic-validation-middleware';
import { guard400 } from '../_common/validators/guard-middleware';
import { searchNameTermQueryValidationMiddleware } from '../_common/validators/searchNameTerm-query-validation-middleware';
import { pageNumberQueryValidationMiddleware } from '../_common/validators/pageNumber-validation-middleware';
import { sortByBlogsQueryValidationMiddleware } from '../_common/validators/sortByBlogs-validation-middleware';
import { pageSizeQueryValidationMiddleware } from '../_common/validators/pageSize-validation-middleware';
import { sortDirectionQueryValidationMiddleware } from '../_common/validators/sortDirection-validation-middleware';
import { blogIdParamUriValidationMiddleware } from '../_common/validators/blogId-param-validation-middleware';
import { titleBodyValidationMiddleware } from '../_common/validators/title-validation-middleware';
import { shortdescriptionBodyValidationMiddleware } from '../_common/validators/shortdescription-validation-middleware';
import { contentBodyValidationMiddleware } from '../_common/validators/content-validation-middleware';

import { sortByPostsQueryValidationMiddleware } from '../_common/validators/sortByPosts-validation-middleware';
import blogsController from './blogs-controller';
import { blogIdParamInBDValidationMiddleware } from './validators/blogIdParamInBD-validation-middleware';


export const blogsRoutes = express.Router()


blogsRoutes.get(`/blogs`,
    searchNameTermQueryValidationMiddleware,
    pageNumberQueryValidationMiddleware,
    pageSizeQueryValidationMiddleware,
    sortByBlogsQueryValidationMiddleware,
    sortDirectionQueryValidationMiddleware,
    blogsController.readAllOrByNamePaginationSort)

blogsRoutes.post(`/blogs`,
    authorizationBasicMiddleware401,
    nameBodyValidationMiddleware,
    youtubeUrlBodyValidationMiddleware,
    guard400,
    blogsController.createOne)

blogsRoutes.get(`/blogs/:blogId/posts`,
    blogIdParamUriValidationMiddleware,
    pageNumberQueryValidationMiddleware,
    pageSizeQueryValidationMiddleware,
    sortByPostsQueryValidationMiddleware,
    sortDirectionQueryValidationMiddleware,
    guard400,
    blogIdParamInBDValidationMiddleware,
    <any>blogsController.readAllPostsByBlogIdWithPaginationAndSort)

blogsRoutes.post(`/blogs/:blogId/posts`,
    authorizationBasicMiddleware401,
    blogIdParamUriValidationMiddleware,
    titleBodyValidationMiddleware,
    shortdescriptionBodyValidationMiddleware,
    contentBodyValidationMiddleware,
    guard400,
    blogIdParamInBDValidationMiddleware,
    blogsController.createPostsByBlogId)

blogsRoutes.get(`/blogs/:blogId`,
    blogIdParamUriValidationMiddleware,
    guard400,
    blogIdParamInBDValidationMiddleware,
    blogsController.readOne)

blogsRoutes.put(`/blogs/:blogId`,
    authorizationBasicMiddleware401,
    blogIdParamUriValidationMiddleware,
    nameBodyValidationMiddleware,
    youtubeUrlBodyValidationMiddleware,
    guard400,
    blogIdParamInBDValidationMiddleware,
    blogsController.updateOne)

blogsRoutes.delete(`/blogs/:blogId`,
    authorizationBasicMiddleware401,
    blogIdParamUriValidationMiddleware,
    guard400,
    blogIdParamInBDValidationMiddleware,
    blogsController.deleteOne)


 