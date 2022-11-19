import { NextFunction, Request, Response } from 'express';
import { HTTP_STATUSES, ResponseWithCode } from '../services/http-service/types';



export class DdosGuard {

    private requests: { [key: string]: number } = {}

    logRequest(
        req: Request & { ip: string },
        res: Response,
        next: NextFunction
    ) {
        console.log('DDOS logRequest requests:', this.requests);
        const ip: string = req.ip
        const url: string = req.url
        
        const count: number = this.requests[`${ip}${url}`]
        count ? this.requests[ip + url]++ : this.requests[ip + url] = 1
        console.log('DDOS logRequest requests:', this.requests);
        next()
    }
    checkRequest(
        req: Request,
        res: ResponseWithCode<429>,
        next: NextFunction
    ) {
        console.log('DDOS checkRequest requests:', this.requests);
        const ip: string = req.ip
        const url: string = req.url
        const count: number = this.requests[`${ip}${url}`]
        if (count > 5) return res.sendStatus(HTTP_STATUSES.TOO_MANY_REQUESTS_429)
        next()
    }
    deleteLogs() {
        // console.log("DDOS deleteLogs");
        this.requests = {}
    }
}
export default new DdosGuard()