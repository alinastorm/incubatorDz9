import express from 'express';
import { JwtRefreshTokenCookies401 } from '../../_common/guards/JwtRefreshTokenCookies-middleware';
import tokensController from './tokens-controller';




export const authRouter = express.Router()


authRouter.post(`/auth/refresh-token`,
    JwtRefreshTokenCookies401,
    // authCookiesRefreshTokenIsRottenMiddleware,
    <any> tokensController.refreshTokens
)


