import { NextFunction } from 'express';
import { HTTP_STATUSES, RequestWithCookies, ResponseWithBodyCode, ResponseWithCode } from '../services/http-service/types';
import { jwtService } from '../services/jwt-service';

/** Проверка рефереш токена на валидность и тухлость */
export const JwtRefreshTokenCookies401 = async (
    req: RequestWithCookies<{ refreshToken: string }> & { user?: { userId?: string, deviceId?: string } },
    res: ResponseWithCode<401>,
    next: NextFunction
) => {

    //Проверка наличия cookies авторизации
    const reqRefreshToken = req.cookies.refreshToken
    console.log(reqRefreshToken);   
    if (!reqRefreshToken) return res.status(401).send("no refreshToken")

    //проверяем валидность, тухлость, состав
    const userId = jwtService.getDataByRefreshToken(reqRefreshToken)?.userId
    const deviceId = jwtService.getDataByRefreshToken(reqRefreshToken)?.deviceId
    if (!userId || !deviceId) return res.status(HTTP_STATUSES.UNAUTHORIZED_401).send("no valid refreshToken")

    //Мутируем req
    req.user = { userId, deviceId } //TODO глаза мне мозолит этот userId в req
    next()
}
