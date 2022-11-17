import { NextFunction, Request, Response } from 'express';
import { HTTP_STATUSES, RequestWithHeaders, ResponseWithBodyCode } from '../services/http-service/types';
import { APIErrorResult } from '../validators/types';


export const BasicAuthorizationMiddleware = (
    req: RequestWithHeaders<{ authorization: string }>,
    res: ResponseWithBodyCode<APIErrorResult, 401>,
    next: NextFunction) => {

    const auth = { login: 'admin', password: 'qwerty' }    
    const isBasicAuthorization = req.headers.authorization.startsWith('Basic')
    // parse login and password from headers
    const b64auth = (req.headers.authorization || '').split(' ')[1] || ''
    const [login, password] = Buffer.from(b64auth, 'base64').toString().split(':')

    // Verify login and password 
    if (isBasicAuthorization && login && password && login === auth.login && password === auth.password) {

        // Access 
        return next()
    }
    return res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
}
