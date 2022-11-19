import express from 'express';
import { nameBodyValidationMiddleware } from '../_common/validators/name-validation-middleware';
import { websiteUrlBodyValidationMiddleware } from '../_common/validators/websiteUrl-validation-middleware';
import { BasicAuthorizationMiddleware } from '../_common/guards/BasicAuthHeaders-validation-middleware';
import { code400 } from '../_common/validators/code400-middleware';
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
import { blogIdParamInBDValidationMiddleware } from '../_common/validators/blogIdParamInBD-validation-middleware';
import { descriptionBodyValidationMiddleware } from '../_common/validators/description-body-validation-middleware';


export const blogsRouter = express.Router()


blogsRouter.get(`/blogs`,
    searchNameTermQueryValidationMiddleware,
    pageNumberQueryValidationMiddleware,
    pageSizeQueryValidationMiddleware,
    sortByBlogsQueryValidationMiddleware,
    sortDirectionQueryValidationMiddleware,
    blogsController.readAllOrByNamePaginationSort
)
blogsRouter.post(`/blogs`,
    <any>BasicAuthorizationMiddleware,
    nameBodyValidationMiddleware,
    websiteUrlBodyValidationMiddleware,
    descriptionBodyValidationMiddleware,
    code400,
    blogsController.createOne
)
blogsRouter.get(`/blogs/:blogId/posts`,
    blogIdParamUriValidationMiddleware,
    pageNumberQueryValidationMiddleware,
    pageSizeQueryValidationMiddleware,
    sortByPostsQueryValidationMiddleware,
    sortDirectionQueryValidationMiddleware,
    code400,
    blogIdParamInBDValidationMiddleware,
    <any> blogsController.readAllPostsByBlogIdWithPaginationAndSort
)
blogsRouter.post(`/blogs/:blogId/posts`,
    <any> BasicAuthorizationMiddleware,
    blogIdParamUriValidationMiddleware,
    titleBodyValidationMiddleware,
    shortdescriptionBodyValidationMiddleware,
    contentBodyValidationMiddleware,
    code400,
    blogIdParamInBDValidationMiddleware,
    blogsController.createPostsByBlogId
)
blogsRouter.get(`/blogs/:blogId`,
    blogIdParamUriValidationMiddleware,
    code400,
    blogIdParamInBDValidationMiddleware,
    blogsController.readOne
)
blogsRouter.put(`/blogs/:blogId`,
<any>BasicAuthorizationMiddleware,
    blogIdParamUriValidationMiddleware,
    nameBodyValidationMiddleware,
    websiteUrlBodyValidationMiddleware,
    code400,
    blogIdParamInBDValidationMiddleware,
    blogsController.updateOne
)
blogsRouter.delete(`/blogs/:blogId`,
<any>BasicAuthorizationMiddleware,
    blogIdParamUriValidationMiddleware,
    code400,
    blogIdParamInBDValidationMiddleware,
    blogsController.deleteOne
)


