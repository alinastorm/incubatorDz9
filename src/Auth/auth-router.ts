import express from 'express';


import { guard400 } from '../_common/validators/guard-middleware';
import { authHeadersJwtMiddleware } from '../_common/validators/authHeadersJwtAccessToken-middleware';
import authController from './auth-controller';
import { loginBodyValidationMiddleware } from '../_common/validators/login-body-validation-middleware';
import { passwordBodyValidationMiddleware } from '../_common/validators/password-body-validation-middleware';
import { emailBodyValidationMiddleware } from '../_common/validators/email-validation-middleware';
import { schemaLoginInputValidationMiddleware } from '../_common/validators/schemaLoginInput-validation-middleware';
import { codeConfirmBodyValidationMiddleware } from '../_common/validators/codeConfirm-body-validation-middleware';
import { authCookiesRefreshTokenMiddleware } from '../_common/validators/authCookiesRefreshToken-middleware';



export const authRoutes = express.Router()

authRoutes.post(`/auth/login`,
    // loginBodyValidationMiddleware,
    // passwordBodyValidationMiddleware,
    schemaLoginInputValidationMiddleware,
    guard400,
    <any> authController.login)

authRoutes.post(`/auth/refresh-token`,
    authCookiesRefreshTokenMiddleware,
    <any> authController.refreshTokens)

authRoutes.post(`/auth/registration-confirmation`,
    codeConfirmBodyValidationMiddleware,
    guard400,
    authController.confirmRegistration
)

authRoutes.post(`/auth/registration`,
    loginBodyValidationMiddleware,
    passwordBodyValidationMiddleware,
    emailBodyValidationMiddleware,
    guard400,
    <any> authController.registration
)
//TODO есть ли удобный способ передать payload между middleware что бы не мутировать req resp?
authRoutes.post(`/auth/registration-email-resending`,
    emailBodyValidationMiddleware,//Email of already registered but not confirmed user
    guard400,
    <any> authController.resendEmail
)

authRoutes.post(`/auth/logout`,
    authCookiesRefreshTokenMiddleware,
    <any>authController.logout
)

authRoutes.get(`/auth/me`,
    <any> authHeadersJwtMiddleware,
    <any> authController.getUser)
