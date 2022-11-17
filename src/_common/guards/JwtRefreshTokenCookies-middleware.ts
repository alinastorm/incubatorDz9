import { NextFunction, Response } from 'express';
import { RequestWithCookies, ResponseWithBodyCode } from '../services/http-service/types';
import { jwtService } from '../services/jwt-service';
import { APIErrorResult } from '../validators/types';

/** Проверка рефереш токена на валидность и тухлость */
export const JwtRefreshTokenCookies401 = async (
    req: RequestWithCookies<{ refreshToken: string }> & { user?: { userId?: string, deviceId?: string } },
    res: ResponseWithBodyCode<APIErrorResult, 401>,
    next: NextFunction
) => {

    //Проверка наличия cookies авторизации
    const reqRefreshToken = req.cookies.refreshToken
    if (!reqRefreshToken) return res.sendStatus(401)

    //проверяем валидность, тухлость, состав
    const userId = jwtService.getDataByRefreshToken(reqRefreshToken)?.userId
    const deviceId = jwtService.getDataByRefreshToken(reqRefreshToken)?.deviceId
    if (!userId || !deviceId) return res.sendStatus(401)

    //Мутируем req
    req.user = { userId, deviceId } //TODO глаза мне мозолит этот userId в req
    next()
}
