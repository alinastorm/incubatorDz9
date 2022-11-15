import express from 'express';

import { guard400 } from '../_common/validators/guard-middleware';
import { commentIdUriParamValidationMiddleware } from '../_common/validators/commentID-param-validation-middleware';
import { commentsInputModelSchemaValidationMiddleware } from '../_common/validators/commentsInputSchema-validation-middleware';
import { authHeadersJwtMiddleware } from '../_common/validators/authHeadersJwtAccessToken-middleware';
import commentsController from './comments-controller';


export const commentsRoutes = express.Router()


commentsRoutes.put(`/comments/:commentId`,
    <any>authHeadersJwtMiddleware,
    commentIdUriParamValidationMiddleware,
    commentsInputModelSchemaValidationMiddleware,
    guard400,
    <any>commentsController.updateOne)

commentsRoutes.delete(`/comments/:commentId`,
    <any>authHeadersJwtMiddleware,
    commentIdUriParamValidationMiddleware,
    guard400,
    <any>commentsController.deleteOne)

commentsRoutes.get(`/comments/:commentId`,
    commentIdUriParamValidationMiddleware,
    guard400,
    commentsController.readOne)

///testing
commentsRoutes.get(`/comments`,
    <any>commentsController.readAll)