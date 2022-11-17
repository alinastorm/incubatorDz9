import rottenTokensRepository from "./rottenTokens-repository"
import { RottenToken } from "./rottenTokens-types"
import add from 'date-fns/add'


/** Deprecated */
export function createOneCanceledToken(reqRefreshToken: string) {
    //добавляем в списаные
    const seconds = process.env.JWT_REFRESH_LIFE_TIME_SECONDS ?? 20

    const expirationDate = add(new Date(), { seconds: Number(seconds) })
    const element: Omit<RottenToken, 'id'> = { refreshToken: reqRefreshToken, expirationDate }
    rottenTokensRepository.createOne(element)
}
/** Deprecated */
export function deleteAllCanceledTokens() {
    rottenTokensRepository.readAll<RottenToken>().then((tokens) => {
        tokens.forEach(token => {
            if (token.expirationDate < new Date()) {
                rottenTokensRepository.deleteOne(token.id)
            }
        })
    })
    console.log('deleteAllCanceledTokens complete');
}