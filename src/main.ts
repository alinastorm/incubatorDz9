
// import mongoDbClient from'./_common/services/mongoDb-service/mongoDbClient'
// import gmail from "./_common/services/email-service/gmail-adapter";
// import periodicTasks from"./_common/services/periodicTasks-service";
// import httpService from './_common/services/http-service/http-service';



// const a = mongoDbClient
// const b = gmail
// const c = periodicTasks
// const d = httpService
import express, { Request, Response } from 'express';
import nodemailer from "nodemailer";

const app = express()
const port = process.env.PORT || 5000

const parserMiddleware = express.json()
app.use(parserMiddleware)


app.get('/', async (req: Request, res: Response) => {
  // const transporter = nodemailer.createTransport({
  //   service: 'gmail',
  //   secure: false,
  //   auth: {
  //     user: 'ubt.mailer@gmail.com',
  //     pass: 'ptzbiemtjjmbkbbs'
  //   }
  // });

  const transporter = nodemailer.createTransport({
    port: 465,
    host: "smtp.gmail.com",
    auth: {
      user: "ubt.mailer@gmail.com",
      pass: "ptzbiemtjjmbkbbs",
    },
    secure: true,
  });

  const mailOptions = {
    from: 'ubt.mailer@gmail.com',
    to: '7534640@gmail.com',
    subject: '9',
    text: 'Email content'
  };

  // await transporter.sendMail(mailOptions, function (error: any, info: any) {
  //   if (error) {
  //     console.log(error);
  //   } else {
  //     console.log('Email sent: ' + info.response);
  //     // do something useful
  //   }
  // });
  await new Promise((resolve, reject) => {
    // verify connection configuration
    transporter.verify(function (error, success) {
      if (error) {
        console.log(error);
        reject(error);
      } else {
        console.log("Server is ready to take our messages");
        resolve(success);
      }
    });
  });

  await new Promise((resolve, reject) => {
    // send mail
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error(err);
        reject(err);
      } else {
        console.log(info);
        resolve(info);
      }
    });
  });

  res.send("9")
})


const startApp = async () => {
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })
}

startApp()
