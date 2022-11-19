import express, { Request, Response } from 'express';
import testingController from './testing-controller';


export const testingRouter = express.Router()


testingRouter.get('/',
    (req: Request, res: Response) => {
res.send("Hallo Samurai")
    }
)
testingRouter.delete('/testing/all-data',
    testingController.deleteAll,
)
testingRouter.all("*", (req: Request, res, next) => {
    if (req.url === "/auth/registration") {
        console.log("*****************************************");
        console.log('\x1b[36m%s\x1b[0m', 'req.method:', req.method, req.url);
        console.log('\x1b[32m%s\x1b[0m', 'req.body:', req.body);
        console.log('\x1b[31m%s\x1b[0m', 'req.cookies:', req.cookies);
        console.log('\x1b[33m%s\x1b[0m', 'req.headers:', JSON.stringify(req.headers));
        console.log("*****************************************");
    }

    //req.time = new Date().getTime();
    // const start = req.time
    // const end = new Date().getTime();
    // console.log(`SecondsWay: ${end - start}ms`);
    next();
}
)



