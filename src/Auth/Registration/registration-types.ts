export interface RegistrationCodeViewModel {
    id: string
    userId: string
    email: string
    code: string
    expirationDate: Date
    // restartTime: Date
}
export interface RegistrationConfirmationCodeModel {
    /**Code that be sent via Email inside link */
    code: string
}

export interface RegistrationEmailResending {
    /**Email of already registered but not confirmed user */
    email: string //    pattern: ^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$  
}