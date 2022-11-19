import nodemailer from "nodemailer"
import Mail from "nodemailer/lib/mailer"
import SMTPTransport from "nodemailer/lib/smtp-transport"



const options: SMTPTransport | SMTPTransport.Options | string = {
    service: 'gmail',
    auth: {
        user: process.env.SMTP_USER || '',
        pass: process.env.SMTP_PASSWORD || '',
    },
}

class EmailService {

    transport!: nodemailer.Transporter<SMTPTransport.SentMessageInfo>

    constructor(private options: SMTPTransport | SMTPTransport.Options | string) {
        this.createTransporter()
     }
    //async constructor
    async then(resolve: any, reject: any) {
        console.log('EmailService ... ');
        try {
            this.createTransporter()
            Object.assign(this, { then: null })
            resolve(this)
        } catch (error) {
            this.stop()
            console.log('EmailService error:', error);
        }
    }

    createTransporter() {
        const transport = nodemailer.createTransport(this.options)
        if (!transport) throw Error('EmailService createTransporter error')
        this.transport = transport
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

        const info = this.transport.sendMail(mailOptions, (err) => { })


    }
    sendEmail(to: string, subject: string, message: string) {
        const mailOptions: Mail.Options = {
            from: `${process.env.APP_NAME} <${process.env.SMTP_USER}>`,
            to,
            subject,
            text: '',
            html: message
        }

        const info = this.transport.sendMail(mailOptions, (err, data) => {
            if (err) console.log("EmailService error:", err)
            if (data) console.log('transporter.sendMail data:', data)

        })

    }
    stop() {
        this.transport.close()
    }
}
//@ts-ignore
export default new EmailService(options)