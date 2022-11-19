import nodemailer, { Transporter } from "nodemailer"
import Mail from "nodemailer/lib/mailer"
import SendmailTransport from "nodemailer/lib/sendmail-transport";




const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
    }
});

class EmailService {

    constructor(private transporter: Transporter<SendmailTransport.SentMessageInfo>) {
        console.log('EmailService ... ');
        console.log("EmailService started");
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
    sendEmail(to: string, subject: string, message: string) {
        const mailOptions: Mail.Options = {
            from: `${process.env.APP_NAME} <${process.env.SMTP_USER}>`,
            to,
            subject,
            text: '',
            html: message
        }

        const info = this.transporter.sendMail(mailOptions, (err, data) => {
            if (err) console.log("EmailService error:", err)
            if (data) console.log('transporter.sendMail data:', data)

        })

    }
    stop() {
        this.transporter.close()
    }
}
//@ts-ignore
export default new EmailService(transporter)