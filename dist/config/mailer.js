"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SMTPMailer = void 0;
const nodemailer = require("nodemailer");
const common_1 = require("@nestjs/common");
const secrets_1 = require("../common/config/secrets");
class Mailer {
    constructor() {
        this.logger = new common_1.Logger("Mailer");
        this.transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: secrets_1.MAILER_EMAIL_ID,
                pass: secrets_1.MAILER_PASSWORD,
            },
        });
    }
    sendMail(receiver, subject, text, senderName = "Rikikudo Support") {
        const mailOptions = {
            from: `"${senderName}" ${secrets_1.MAILER_EMAIL_ID}`,
            to: receiver,
            subject,
            html: text,
        };
        this.transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                console.error(err);
            }
            else {
                this.logger.verbose(`Message sent: ${info.messageId}`);
                this.logger.verbose(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
            }
        });
    }
    async sendMails(receivers, subject, text) {
        const mailOptions = {
            from: secrets_1.MAILER_EMAIL_ID,
            bcc: receivers,
            subject,
            html: text,
        };
        const info = (await this.transporter.sendMail(mailOptions));
        this.logger.verbose(`Message sent: ${info.messageId}`);
        this.logger.verbose(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
    }
}
exports.SMTPMailer = new Mailer();
//# sourceMappingURL=mailer.js.map