import { NextFunction, Request, Response } from 'express';
import { HTTP_STATUSES, ResponseWithCode } from '../services/http-service/types';



export class DdosGuard {

    private requests: { [key: string]: number } = {}

    logRequests(
        req: Request & { ip: string },
        res: Response,
        next: NextFunction
    ) {
        const ip: string = req.ip
        const url: string = req.url
        const count: number = this.requests[`${ip}${url}`]
        if (!count) this.requests[ip + url] = 1
        this.requests[ip + url]++
        next()
    }
    checkDdos(
        req: Request,
        res: ResponseWithCode<429>,
        next: NextFunction
    ) {
        const ip: string = req.ip
        const url: string = req.url
        const count: number = this.requests[`${ip}${url}`]
        if (!count) return next()
        count
        if (count > 5) return res.sendStatus(HTTP_STATUSES.TOO_MANY_REQUESTS_429)
        next()
    }
    deleteLogs() {
        this.requests = {}
        console.log('Logs deleted');
    }
}
export default new DdosGuard()