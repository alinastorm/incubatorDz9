import { Request, Response } from 'express';

import nodemailer, { Transporter } from "nodemailer"
import Mail from "nodemailer/lib/mailer"
import SendmailTransport from "nodemailer/lib/sendmail-transport";



console.log('EmailService ... ');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    // secure : true, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
    },
    //  tls: {
    //     // do not fail on invalid certs
    //     rejectUnauthorized: false
    // },
});

class EmailService {

    constructor(private transporter: Transporter<SendmailTransport.SentMessageInfo>) {
        console.log("EmailService started", process.env.SMTP_USER, process.env.SMTP_PASSWORD);
    }


    sendActivationMail(to: string | Mail.Address | (string | Mail.Address)[] | undefined, link: string) {
        const mailOptions: Mail.Options = {
            from: `${process.env.APP_NAME} <${process.env.SMTP_USER}>`,
            to,
            subject: `Активация аккаунта ` + process.env.API_URL,
            text: '',
            html:
                `<div>
                 <h1>Добро пожаловать</h1>
                 <h1>Для активации аккаунта необходимо перейти по ссылке:</h1>
                 <a href = "${link}">Активировать аккаунт</a>
                 </div>
                 `
        }

        const info = this.transporter.sendMail(mailOptions, (err) => { })


    }
    async sendEmail(to: string, subject: string, message: string) {
        const mailOptions: Mail.Options = {
            from: `${process.env.APP_NAME} <${process.env.SMTP_USER}>`,
            to,
            subject,
            text: '',
            html: message
        }
        // console.dir(this.transporter);
        // console.log("from:", `${process.env.APP_NAME} <${process.env.SMTP_USER}>`);
        // console.log("to:", to);
        // console.log("this.APP_NAME: ", process.env.APP_NAME);
        // console.log("this.SMTP_USER: ", process.env.SMTP_USER);
        // console.log("this.SMTP_PASSWORD:", process.env.SMTP_PASSWORD);

        await this.transporter.sendMail(mailOptions)
        // const info = this.transporter.sendMail(mailOptions, (err, data) => {
        //     if (err) console.log("EmailService error:", err)
        //     if (data) console.log('transporter.sendMail data:', data)

        // })

    }
    stop() {
        this.transporter.close()
    }
}
//@ts-ignore
export default new EmailService(transporter)