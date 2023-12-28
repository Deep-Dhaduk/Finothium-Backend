const nodemailer = require("nodemailer");

let transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD,
    },
});

/** Send mail */
const sendMail = async (to, otp) => {
    try {
        return transport.sendMail({
            from: process.env.EMAIL_FROM,
            to,
            subject: "OTP for Your Application",
            html: `Your OTP is: ${otp}`,
        });
    } catch (error) {
        return false;
    }
};

module.exports = {
    sendMail
};