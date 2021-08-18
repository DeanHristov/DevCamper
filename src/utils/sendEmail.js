const nodemailer = require("nodemailer");
const colors = require('colors');

const {
    SMTP_EMAIL, SMTP_PASSWORD, SMTP_PORT,
    SMTP_HOST, FROM_EMAIL, FROM_NAME
} = process.env;
async function sendEmail(options) {
    // create reusable transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
        host: SMTP_HOST,
        port: SMTP_PORT,
        secure: false, // true for 465, false for other ports
        auth: {
            user: SMTP_EMAIL, // generated ethereal user
            pass: SMTP_PASSWORD, // generated ethereal password
        },
    });

    // send mail with defined transport object
    const info = await transporter.sendMail({
        from: `${FROM_NAME} <${FROM_EMAIL}>`, // sender address
        to: options.email, // list of receivers
        subject: options.subject, // Subject line
        text: options.message, // plain text body
    });

    console.log(colors.yellow(`Message id: ${info.messageId}`))
}

module.exports = sendEmail;
