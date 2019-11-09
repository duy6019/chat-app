const nodemailer = require('nodemailer');

let adminEmail = process.env.MAIL_USER;
let adminPassword = process.env.MAIL_PASSWORD;
let host = process.env.MAIL_HOST;
let port = process.env.MAIL_PORT;

let sendMail = (to, subject, htmlContent) => {
    let transporter = nodemailer.createTransport({
        host: host,
        port: port,
        secure: false,
        auth: {
            user: adminEmail,
            pass: adminPassword
        }
    });

    let option = {
        from: adminEmail,
        to: to,
        subject: subject,
        html: htmlContent
    }

    return transporter.sendMail(option);
}

module.exports = sendMail;
