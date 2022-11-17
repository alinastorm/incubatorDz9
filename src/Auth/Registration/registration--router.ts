import express from 'express';
import { code400 } from '../../_common/validators/code400-middleware';
import registrationController from "./registration-controller"
import { loginBodyValidationMiddleware } from '../../_common/validators/login-body-validation-middleware';
import { passwordBodyValidationMiddleware } from '../../_common/validators/password-body-validation-middleware';
import { emailBodyValidationMiddleware } from '../../_common/validators/email-validation-middleware';
import { codeConfirmBodyValidationMiddleware } from '../../_common/validators/codeConfirm-body-validation-middleware';



export const authRouter = express.Router()

authRouter.post(`/auth/registration`,
    loginBodyValidationMiddleware,
    passwordBodyValidationMiddleware,
    emailBodyValidationMiddleware,
    code400,
    <any> registrationController.registration
)
authRouter.post(`/auth/registration-confirmation`,
    codeConfirmBodyValidationMiddleware,
    code400,
    registrationController.confirmRegistration
)
authRouter.post(`/auth/registration-email-resending`,
    emailBodyValidationMiddleware,//Email of already registered but not confirmed user
    code400,
    <any> registrationController.resendEmail
)

