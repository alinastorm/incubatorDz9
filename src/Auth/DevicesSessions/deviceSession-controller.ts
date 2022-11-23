import { Request, Response } from 'express';
import { HTTP_STATUSES, RequestWithCookies, RequestWithParams, ResponseWithBodyCode, ResponseWithCode } from '../../_common/services/http-service/types';
import { DeviceBdModel, DeviceViewModel } from './deviceSession-types';
import devicesRepository from './deviceSessions-repository';
import { RefreshTokenPayloadModel } from '../Tokenization/tokens-types';
import format from 'date-fns/add'


class DeviceController {

    async readAll(
        req: RequestWithCookies<{ refreshToken: string }> & { user: RefreshTokenPayloadModel },
        res: ResponseWithBodyCode<DeviceViewModel[], 200>
    ) {
        const userId = req.user.userId
        const deviceSessions = await devicesRepository.readAll<DeviceBdModel>({ userId })
        const result: DeviceViewModel[] = deviceSessions.map(({ deviceId, ip, title, lastActiveDate }) => {
            return { deviceId, ip, title, lastActiveDate: new Date(+lastActiveDate*1000).toISOString() }
        })
        res.send(result)
    }
    async deleteAllExcludeCurrent(
        req: RequestWithCookies<{ refreshToken: string }>
            & { user: RefreshTokenPayloadModel },
        res: ResponseWithCode<204>
    ) {
        const userId = req.user.userId
        const tokenDeviceId = req.user.deviceId
        const deviceSessions = await devicesRepository.readAll<DeviceBdModel>({ userId })
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
        // const tokenDeviceId = req.user?.deviceId
        const uriDeviceId = req.params.deviceId
        //проверяем существование сессии по uriDeviceId
        const deviceSessionsByTokenDeviceId = await devicesRepository.readAll<DeviceBdModel>({ deviceId: uriDeviceId })
        if (!deviceSessionsByTokenDeviceId.length) return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        //фильтруем сессии uriDeviceId по владельцу userId из токена
        const filterSessionsByUserId = deviceSessionsByTokenDeviceId.filter((ds) => {
            return ds.userId === userId
        })
        if (!filterSessionsByUserId.length) return res.sendStatus(HTTP_STATUSES.NO_ACCESS_CONTENT_403)
        //удаляем сессии по uriDeviceId
        filterSessionsByUserId.forEach(async (ds) => {
            await devicesRepository.deleteOne(ds.id)
        })
        //ответ
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    }

}
export default new DeviceController 