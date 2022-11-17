import express from 'express';
import testingController from './testing-controller';


export const testingRouter = express.Router()


testingRouter.delete('/testing/all-data',
    testingController.deleteAll,
)
testingRouter.all("*", (req: any, res, next) => {
    // if (req.url === '/auth/logout') {        
    //     console.log("**********");        
    //     console.log('req.method:', req.method);
    //     console.log('req.headers:', req.headers);
    //     console.log('req.url:', req.url);
    //     console.log('req.params:', req.params);
    //     console.log('req.query:', req.query);
    //     console.log('req.body:', req.body);
    //     console.log('req.cookies:', req.cookies);
    // }

    //req.time = new Date().getTime();
    // const start = req.time
    // const end = new Date().getTime();
    // console.log(`SecondsWay: ${end - start}ms`);
    next();
}
)



