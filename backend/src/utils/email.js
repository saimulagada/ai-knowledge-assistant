const nodemailer = require("nodemailer");
require("dotenv").config();
const transporter = nodemailer.createTransport({

    service: "gmail",

    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
    }

    

});
console.log("EMAIL:", process.env.EMAIL);
console.log("PASSWORD:", process.env.EMAIL_PASSWORD ? "Loaded" : "Missing");

async function sendEmail({ to, subject, html }) {
    console.log("Before Sending Email");

    const info = await transporter.sendMail({
        from: process.env.EMAIL,
        to,
        subject,
        html
    });

    console.log("After Sending Email");
    console.log(info);
}

module.exports = sendEmail;