//TODO реализовать удаление не активированных пользователей
//TODO реализовать удаление link code активации

import { deleteAllCanceledTokens } from "../../Auth/Tokenization/RottenTokens/rottenTokens-service";
import DdosGuard from "../guards/ddos-middleware";


const restartTime = process.env.TIME_RESTART_PERIODICTASKS_SECONDS ?? 10 * 1000


class PeriodicTasks {
    tasks = [
        // deleteAllCanceledTokens,
        DdosGuard.deleteLogs
    ]

    async then(resolve: any, reject: any) {
        console.log('PeriodicTasks ...');

        try {
            this.run()
            resolve(true)
        } catch (error) {
            console.log('PeriodicTasks error:', error);
            // reject(this)
        }
    }
    run() {
        console.log('PeriodicTasks started');

        setInterval(() => {
            this.tasks.forEach(handler => {
                handler()
            })
        }
            , +restartTime)
    }
}

//@ts-ignore
export default await new PeriodicTasks()