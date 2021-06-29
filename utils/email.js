const nodemailer = require('nodemailer');

const sendEmail = async options => {
    // 1) Create a transporter.
    const transporter = nodemailer.createTransport({

        // To user the service with Gmail
        // Activate in gmail "less secure app" option
        // service: 'Gmail',
        // auth: {
        //     user: process.env.EMAIL_USERNAME,
        //     pass: process.env.EMAIL_PASSWORD,
        // }

        //  We're using Mailtrap here for testing purposes.
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        },
        tls:{
            rejectUnauthorized:false
        }
    });

    // 2) Define email options.
    const mailOptions = {
        from: 'Capitano Barbarossa <barbarossa2018@outlook.com',
        to: options.email,
        subject: options.subject,
        text: options.message,
        // html:
    };

    // 3) Send the email.
    await transporter.sendMail(mailOptions);
}

module.exports = sendEmail;