import express from 'express';
import cookieParser from 'cookie-parser';
import fs from "node:fs"
import https from "node:https"

import * as core from 'express-serve-static-core';
import * as http from 'http';
import { authRouter } from '../../../Auth/Authentication/auth--router';
import { blogsRouter } from '../../../Blogs/blogs--router';
import { commentsRouter } from '../../../Comments/comments--router';
import { postsRouter } from '../../../Posts/posts--router';
import { testingRouter } from '../../../Testing/testing--router';
import { usersRouter } from '../../../Users/users--router';
import { registrationRouter } from '../../../Auth/Registration/registration--router';
import { devicesRouter } from '../../../Auth/DevicesSessions/deviceSession--router';
import { tokensRouter } from '../../../Auth/Tokenization/tokens--router';


class HttpService {
    constructor() {
        console.log('HttpService ... ');
        try {
            this.setMiddlewares()
            this.setRoutes()
            this.runHttpServer()
            this.runHttpsServer()
        } catch (error) {
            this.stopServer()
            console.log('HttpService error:', error);
        }
    }
    app: core.Express = express()
    httpServer!: http.Server
    httpsServer!: https.Server
    httpPort: number | string = process.env.PORT || process.env.HTTP_PORT || 80
    httpsPort: number | string = process.env.HTTPS_PORT || 443

    //async constructor
    async then(resolve: any, reject: any) {
        console.log('HttpService ... ');
        try {
            this.setMiddlewares()
            this.setRoutes()
            this.runHttpServer()
            this.runHttpsServer()
            resolve()
        } catch (error) {
            this.stopServer()
            console.log('HttpService error:', error);
        }

    }
    runHttpServer() {
        const httpServer = http.createServer(this.app);

        this.httpServer = httpServer.listen(this.httpPort, () => {
            console.log(`HTTP Server running on port ${this.httpPort}`);
        });

    }
    runHttpsServer() {
        // SSL Certificate
        const privateKey = fs.readFileSync('./ssl/ubt.by-key.pem', 'utf-8')
        const certificate = fs.readFileSync('./ssl/ubt.by-crt.pem', 'utf-8')
        const ca = fs.readFileSync('./ssl/ubt.by-chain-only.pem', 'utf8');

        const credentials = {
            key: privateKey,
            cert: certificate,
            ca: ca
        }

        const httpsServer = https.createServer(credentials, this.app);

        this.httpsServer = httpsServer.listen(this.httpsPort, () => {
            console.log(`HTTPS Server running on port ${this.httpsPort}`);
        });

    }
    setMiddlewares() {
        this.app.use(express.json())
        this.app.use(cookieParser())
        this.app.set('trust proxy', true) // Для получения корректного ip-адреса из req.ip
    }
    setRoutes() {
        this.app.use([
            testingRouter,
            blogsRouter,
            postsRouter,
            usersRouter,
            authRouter,
            commentsRouter,
            registrationRouter,
            devicesRouter,
            tokensRouter
        ])
    }
    stopServer() {
        this.httpServer?.close()
        this.httpsServer?.close()
    }


}
//@ts-ignore
export default new HttpService()