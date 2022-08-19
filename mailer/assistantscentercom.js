const nodemailer = require('nodemailer')
const { host, port, auth } = require('./config')

const Mailers = {
    noreply: auth.noreply,
    billing: auth.billing,
}

class AssistantsCenterMailer {
    constructor(mailer) {
        this.mailer = mailer
        this.transporter = nodemailer.createTransport({
            host: host,
            port: port,
            secure: false,
            auth: mailer,
            tls: {
                rejectUnauthorized: false
            },
        })
    }

    sendMail = async ({ to_email, from_name, subject, html_content, attachments=[] }) => {
        await this.transporter.sendMail({
            from: `"${from_name || "Assistants Center"}" <${this.mailer.user/*.replace('assistants.ga', 'assistantscenter.com')*/}>`,
            to: to_email,
            subject,
            attachments: attachments,
            html: html_content,
        })
    }
}

module.exports = {
    AssistantsCenterMailer,
    Mailers
}
