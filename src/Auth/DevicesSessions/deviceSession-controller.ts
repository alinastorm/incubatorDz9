import { Request, Response } from 'express';
import { HTTP_STATUSES, RequestWithCookies, RequestWithParams, ResponseWithBodyCode, ResponseWithCode } from '../../_common/services/http-service/types';
import { DeviceBdModel, DeviceViewModel } from './deviceSession-types';
import devicesRepository from './deviceSession-repository';
import { RefreshTokenPayloadModel } from '../Tokenization/tokens-types';

class DeviceController {

    async readAll(
        req: RequestWithCookies<{ refreshToken: string }> & { user: RefreshTokenPayloadModel },
        res: ResponseWithBodyCode<DeviceViewModel[], 200>
    ) {
        const userId = req.user.userId
        const result = await devicesRepository.readAll<DeviceViewModel>({ userId })
        res.send(result)
    }
    async deleteAllExcludeCurrent(
        req: RequestWithCookies<{ refreshToken: string }> & { user: RefreshTokenPayloadModel },
        res: Response
    ) {
        const userId = req.user.userId
        const tokenDeviceId = req.user.deviceId
        const deviceSessions = await devicesRepository.readAll<DeviceBdModel>({ deviceId: tokenDeviceId, userId })
        deviceSessions.forEach((session) => {
            if (session.deviceId != tokenDeviceId) devicesRepository.deleteOne(session.id)
        })
        //ответ
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    }
    async deleteOne(
        req: RequestWithParams<{ deviceId: string }> & { user: RefreshTokenPayloadModel },
        res: ResponseWithCode<204 | 403 | 404>
    ) {
        const userId = req.user.userId
        const tokenDeviceId = req.user?.deviceId
        const uriDeviceId = req.params.deviceId
        //проверяем владение deviceId 
        if (uriDeviceId != tokenDeviceId) return res.sendStatus(403)
        //проверяем наличие сессии по deviceId
        const deviceSessions: DeviceViewModel[] = await devicesRepository.readAll<DeviceViewModel>({ deviceId: tokenDeviceId, userId })
        if (!deviceSessions.length) return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        //удаляем сессию
        devicesRepository.deleteOne(tokenDeviceId)
        //ответ
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    }

}
export default new DeviceController 