import { UserInputModel, UserViewModel } from "../../Users/users-types";
import usersRepository from "../../Users/users-repository";
import cryptoService from "../../_common/services/crypto-service";
import { RegistrationConfirmationCodeModel, RegistrationEmailResending } from "./registration-types"
import { HTTP_STATUSES, RequestWithBody, ResponseWithBodyCode, ResponseWithCode } from "../../_common/services/http-service/types"
import { APIErrorResult } from "../../_common/validators/types"
import authRepository from "../Authentication/auth-repository";
import { RegistrationCodeViewModel } from "./registration-types"
import registrationRepository from './registration-repository';
import emailService from "../../_common/services/email-service/gmail-adapter"
import { v4 as uuidv4 } from 'uuid'
import add from 'date-fns/add'
import { AuthViewModel } from "../Authentication/auth-types"


class AuthController {

    async registration(
        req: RequestWithBody<UserInputModel>,
        res: ResponseWithCode<204> & ResponseWithBodyCode<APIErrorResult, 400>
    ) {

        const { email, login, password } = req.body

        const filterLogin: Partial<UserViewModel> = { login }
        const usersByLogin: UserViewModel[] = await usersRepository.readAll<UserViewModel>(filterLogin)
        if (usersByLogin.length) {
            const result: APIErrorResult = { errorsMessages: [{ message: "login exist", field: "login" }] }
            return res.status(400).json(result)
        }
        const filterEmail: Partial<UserViewModel> = { email }
        const usersByEmails: UserViewModel[] = await usersRepository.readAll<UserViewModel>(filterEmail)
        if (usersByEmails.length) {
            const result: APIErrorResult = { errorsMessages: [{ message: "email exist", field: "email" }] }
            return res.status(400).json(result)
        }

        const createdAt = new Date().toISOString()
        const queryUser: Omit<UserViewModel, 'id'> = { email, login, createdAt, confirm: false }
        const userId: string = await usersRepository.createOne(queryUser)

        const passwordHash = await cryptoService.generatePasswordHash(password)
        const queryAuth: Omit<AuthViewModel, "id"> = { passwordHash, userId, createdAt }
        const idAuth: string = await authRepository.createOne(queryAuth)

        const subject = "activation code"
        const code = uuidv4()
        const link = `${process.env.API_URL}/auth/registration-confirmation?code=${code}`
        const message =
            `
            <h1>Thank for your registration</h1>
            <p>To finish registration please follow the link below:
               <a href='${link}'>complete registration</a>
           </p>
        `
        try {
            emailService.sendEmail(email, subject, message)
        } catch (error) {
            await usersRepository.deleteOne(userId)
            await authRepository.deleteOne(idAuth)
            const result: APIErrorResult = { errorsMessages: [{ message: "send mail error", field: "email" }] }
            return res.status(400).json(result)
        }

        const expirationDate = add(new Date(), {
            hours: 1,
            minutes: 3
        })
        const restartTime = add(new Date(), {
            minutes: 2
        })
        const element: Omit<RegistrationCodeViewModel, 'id'> = { email, code, expirationDate, userId, restartTime }
        await registrationRepository.createOne<RegistrationCodeViewModel>(element)

        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)

    }
    async confirmRegistration(
        req: RequestWithBody<RegistrationConfirmationCodeModel>,
        res: ResponseWithCode<204> & ResponseWithBodyCode<APIErrorResult, 400>
    ) {

        const code = req.body.code
        const codes = await registrationRepository.readAll<RegistrationCodeViewModel>({ code })

        if (!codes.length) {
            const result: APIErrorResult = { errorsMessages: [{ message: "code not found", field: "code" }] }
            return res.status(400).json(result)
        }
        if (codes[0].expirationDate < new Date()) {
            const result: APIErrorResult = { errorsMessages: [{ message: "code expired", field: "code" }] }
            return res.status(400).json(result)
        }

        const userId = codes[0].userId
        await usersRepository.updateOne<UserViewModel>(userId, { confirm: true })

        const codesUser = await registrationRepository.readAll<RegistrationCodeViewModel>({ userId })
        await Promise.all(codesUser.map(async ({ id }) => {
            await registrationRepository.deleteOne<RegistrationCodeViewModel>(id)
        }))

        res.sendStatus(204)
    }
    async resendEmail(
        req: RequestWithBody<RegistrationEmailResending>,
        res: ResponseWithCode<204> & ResponseWithBodyCode<APIErrorResult, 400>
    ) {
        const email = req.body.email
        const filterEmail: Partial<RegistrationCodeViewModel> = { email }
        const codes = await registrationRepository.readAll<RegistrationCodeViewModel>(filterEmail)
        if (!codes.length) {
            const result: APIErrorResult = { errorsMessages: [{ message: "email not found", field: "email" }] }
            return res.status(400).json(result)
        }
        if (codes[0].restartTime < new Date()) {
            const result: APIErrorResult = { errorsMessages: [{ message: "wait 2 minutes", field: "email" }] }
            return res.status(400).json(result)
        }

        const subject = "activation code"
        const code = uuidv4()
        const link = `${process.env.API_URL}/confirm-email?code=${code}`
        const message =
            `
            <h1>Thank for your registration</h1>
            <p>To finish registration please follow the link below:
               <a href='${link}'>complete registration</a>
           </p>
        `
        try {
            emailService.sendEmail(email, subject, message)
        } catch (error) {
            const result: APIErrorResult = { errorsMessages: [{ message: "send mail error", field: "email" }] }
            return res.status(400).json(result)
        }

        const expirationDate = add(new Date(), {
            hours: 1,
            minutes: 3
        })
        const restartTime = add(new Date(), {
            minutes: 0
        })
        const element: Omit<RegistrationCodeViewModel, 'id'> = { email, code, expirationDate, userId: codes[0].userId, restartTime }
        await registrationRepository.createOne<RegistrationCodeViewModel>(element)
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    }
}
export default new AuthController()