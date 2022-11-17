import { NextFunction, Response } from 'express';
import { HTTP_STATUSES, RequestWithHeaders, ResponseWithBodyCode } from '../services/http-service/types';
import { jwtService } from '../services/jwt-service';
import { APIErrorResult } from '../validators/types';


export const authHeadersJwt401 = async (
    req: RequestWithHeaders<{ authorization: string }> & { user?: { userId?: string, deviceId?: string } },
    res: ResponseWithBodyCode<APIErrorResult, 401>,
    next: NextFunction
) => {
    //Проверка заголовка авторизации
    if (!req.headers.authorization) {
        return res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
    }
    //Проверка на bearer
    const [type, accessToken] = req.headers.authorization.split(' ')
    if (type !== "Bearer" || !accessToken) return res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
    // const isBasicAuthorization = req.headers.authorization.startsWith('Basic')

    // //проверяем в списаных
    // const filter: Omit<RottenToken, "expirationDate" | 'id'> = { refreshToken: accessToken }
    // const rootenRefreshBdTokens = await tokensRepository.readAll(filter)
    // if (rootenRefreshBdTokens.length) return res.sendStatus(401)

    //Достаем userId из токена
    const userId = jwtService.getDataByAccessToken(accessToken)?.userId
    if (!userId) return res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)

    //Мутируем req
    req.user = { userId } //TODO глаза мне мозолит этот userId в req
    next()
}
