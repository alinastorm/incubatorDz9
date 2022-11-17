import express from 'express';

import { code400 } from '../_common/validators/code400-middleware';
import { commentIdUriParamValidationMiddleware } from '../_common/validators/commentID-param-validation-middleware';
import { commentsInputModelSchemaValidationMiddleware } from '../_common/validators/commentsInputSchema-validation-middleware';
import { authHeadersJwt401 } from '../_common/guards/JwtAccessTokenHeaders-middleware';
import commentsController from './comments-controller';


export const commentsRouter = express.Router()

commentsRouter.put(`/comments/:commentId`,
    <any> authHeadersJwt401,
    commentIdUriParamValidationMiddleware,
    commentsInputModelSchemaValidationMiddleware,
    code400,
    <any> commentsController.updateOne
)
commentsRouter.delete(`/comments/:commentId`,
    <any> authHeadersJwt401,
    commentIdUriParamValidationMiddleware,
    code400,
    <any> commentsController.deleteOne
)
commentsRouter.get(`/comments/:commentId`,
    commentIdUriParamValidationMiddleware,
    code400,
    commentsController.readOne
)
