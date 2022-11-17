import express from 'express';
import { JwtRefreshTokenCookies401 } from '../../_common/guards/JwtRefreshTokenCookies-middleware';
import { authHeadersJwt401 } from '../../_common/guards/JwtAccessTokenHeaders-middleware';
import { code400 } from '../../_common/validators/code400-middleware';
import { schemaLoginInputValidationMiddleware } from '../../_common/validators/schemaLoginInput-validation-middleware';
import authController from './auth-controller';




export const authRouter = express.Router()

authRouter.post(`/auth/login`,
    schemaLoginInputValidationMiddleware,
    code400,
    <any> authController.Login
)
authRouter.post(`/auth/logout`,
    JwtRefreshTokenCookies401,
    <any> authController.logout
)
authRouter.get(`/auth/me`,
    <any> authHeadersJwt401,//TODO тут по хорошему нужно получить в cookies как в JwtRefreshTokenCookies401
    <any> authController.getUser
)
