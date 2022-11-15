import express from 'express';

import { authorizationBasicMiddleware401 } from '../_common/validators/authBasic-validation-middleware';
import { guard400 } from '../_common/validators/guard-middleware';
import { searchLoginTermQueryValidationMiddleware } from '../_common/validators/searchLoginTerm-query-validation-middleware';
import { searchEmailTermQueryValidationMiddleware } from '../_common/validators/searchEmailTerm-query-validation-middleware';
import { sortDirectionQueryValidationMiddleware } from '../_common/validators/sortDirection-validation-middleware';
import { pageSizeQueryValidationMiddleware } from '../_common/validators/pageSize-validation-middleware';
import { pageNumberQueryValidationMiddleware } from '../_common/validators/pageNumber-validation-middleware';
import { sortByUsersQueryValidationMiddleware } from '../_common/validators/sortByUsers-validation-middleware';
import { loginBodyValidationMiddleware } from '../_common/validators/login-body-validation-middleware';
import { passwordBodyValidationMiddleware } from '../_common/validators/password-body-validation-middleware';
import { emailBodyValidationMiddleware } from '../_common/validators/email-validation-middleware';
import { userIdParamUriValidationMiddleware } from '../_common/validators/userId-param-validation-middleware';
import usersController from './users-controller';


export const usersRoutes = express.Router()


usersRoutes.get(`/users`,
    searchLoginTermQueryValidationMiddleware,
    searchEmailTermQueryValidationMiddleware,
    pageNumberQueryValidationMiddleware,
    pageSizeQueryValidationMiddleware,
    sortByUsersQueryValidationMiddleware,
    sortDirectionQueryValidationMiddleware,
    guard400,
    <any>usersController.readAllPagination)

usersRoutes.post(`/users`,
    authorizationBasicMiddleware401,
    loginBodyValidationMiddleware,
    passwordBodyValidationMiddleware,
    emailBodyValidationMiddleware,
    guard400,
    usersController.createOne)

usersRoutes.delete(`/users/:userId`,
    authorizationBasicMiddleware401,
    userIdParamUriValidationMiddleware,
    guard400,
    usersController.deleteOne)