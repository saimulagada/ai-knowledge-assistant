require("dotenv").config();
const sendEmail = require("./utils/email");

async function test() {
    try {
        await sendEmail({
            to: process.env.EMAIL,
            subject: "Test Email",
            html: "<h1>Hello from Nodemailer</h1>"
        });

        console.log("✅ Email Sent Successfully");
    } catch (err) {
        console.error(err);
    }
}

test();