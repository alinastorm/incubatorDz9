import { HTTP_STATUSES, RequestWithCookies, RequestWithHeaders, ResponseWithBodyCode, ResponseWithCode } from '../../_common/services/http-service/types';
import { jwtService } from '../../_common/services/jwt-service';

import deviceSessionRepository from '../DevicesSessions/deviceSessions-repository';
import { DeviceBdModel } from '../DevicesSessions/deviceSession-types';
import { RefreshTokenPayloadModel } from './tokens-types';


class TokensController {

    /**Generate new pair of access and refresh tokens (in cookie client must send correct refreshToken that will be revoked after refreshing)
     * Клиент отправляет на бек refreshToken в cookie, мы должны вернуть новую пару токенов (старый refreshToken добавляем в списанные)
     */
    async refreshTokens(
        req: RequestWithCookies<{ refreshToken: string }>
            & { user: RefreshTokenPayloadModel }
            // & { ip: string }
            & RequestWithHeaders<{ "user-agent": string }>,
        res:
            ResponseWithBodyCode<{ accessToken: string }, 200> &
            RequestWithCookies<{ refreshToken: string }> &
            ResponseWithCode<401>
    ) {
        //проверяем есть ли сессия в бд соответствующуя из рефреш токена дате(iat) и deviceId 
        const refreshToken = req.cookies.refreshToken
        const { userId, deviceId } = req.user
        const iat: number = jwtService.getIatFromToken(refreshToken) //iat from token
        const lastActiveDate = iat.toString()
        const deviceSessionsByUserDeviceDate = await deviceSessionRepository.readAll<DeviceBdModel>({ userId, deviceId, lastActiveDate })
        const deviceSessionBd: DeviceBdModel = deviceSessionsByUserDeviceDate[0]
        const deviceSessionsByDevice = await deviceSessionRepository.readAll<DeviceBdModel>({ userId, deviceId })
        // проверка  на перехват сессии . Будет другая дата
        if (!deviceSessionBd) {
            if (deviceSessionsByDevice) {
                deviceSessionsByDevice.forEach(async (session) => {
                    const id = session.id
                    await deviceSessionRepository.deleteOne(id)
                })
                //TODO send danger email токен перехвачен дата другая. Сессии этого устройства разорваны
            }

            return res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
        }
        //TODO Проверка смены страны по ip нужен сервис определения// const ip: string = req.ip // IP address of device during signing in 
        // if (deviceSession.ip != ip || deviceSession.title != title) {

        // //проверяем соотвествует ли текущий title из req, сохраненной сессии в бд.
        // const reqTitle: string = req.headers['user-agent']// Device name: for example Chrome 105 (received by parsing http header "user-agent") 
        // if (deviceSessionBd.title != reqTitle) {
        //     // проверка  на перехват сессии . Будет другой ip или title
        //     if (deviceSessionsByDevice) {
        //         deviceSessionsByDevice.forEach(async (session) => {
        //             const id = session.id
        //             await deviceSessionRepository.deleteOne(id)
        //         })
        //         //TODO send danger email токен перехвачен ip или title другой. Сессии этого устройства разорваны
        //     }
        //     return res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
        // }
        //Генерируем токены
        const seconds = process.env.JWT_REFRESH_LIFE_TIME_SECONDS ?? 20
        const newRefreshToken = jwtService.generateRefreshToken({ userId, deviceId })
        const newAccessToken = jwtService.generateAccessToken({ userId })
        //обновляем сессию
        const newIat = jwtService.getIatFromToken(newRefreshToken)
        const newLastActiveDate = newIat.toString()
        const id = deviceSessionBd.id
        const updateData = { lastActiveDate: newLastActiveDate }
        // const data = { ...deviceSessionBd, lastActiveDate: newLastActiveDate }
        await deviceSessionRepository.updateOne<DeviceBdModel>(id, updateData)
        //deprecated //добавляем в списаные
        // const reqRefreshToken = req.cookies.refreshToken
        // createOneCanceledToken(reqRefreshToken)

        res.cookie("refreshToken", newRefreshToken, { maxAge: Number(seconds) * 1000, httpOnly: true, secure: true })// maxAge: 10 milliseconds
        res.status(HTTP_STATUSES.OK_200).json(newAccessToken)
    }

}
export default new TokensController()