import nodemailer, { Transporter } from "nodemailer"
import Mail from "nodemailer/lib/mailer"
import SendmailTransport from "nodemailer/lib/sendmail-transport";




const transporter = nodemailer.createTransport({
    port: 465,
    host: "smtp.gmail.com",
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
    },
    secure: true,
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

    }
    stop() {
        this.transporter.close()
    }
}
//@ts-ignore
export default new EmailService(transporter)