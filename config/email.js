let nodemailer = require('nodemailer');
const path = require('path')
require('dotenv').config();
const environment = process.env;

module.exports.GmailTransport = nodemailer.createTransport({
    service: environment.GMAIL_SERVICE_NAME,
    host: environment.GMAIL_SERVICE_HOST,
    secure:environment.GMAIL_SERVICE_SECURE,
    port: environment.GMAIL_SERVICE_PORT,
    auth: {
        user: environment.GMAIL_USER_NAME,
        pass: environment.GMAIL_USER_PASSWORD
    }
});

// module.exports.SMTPTransport = nodemailer.createTransport({
//     host: environment.SMTP_SERVICE_HOST,
//     port: environment.SMTP_SERVICE_PORT,
//     secure: environment.SMTP_SERVICE_SECURE, // upgrade later with STARTTLS
//     debug: true,
//     auth: {
//         user: environment.SMTP_USER_NAME,
//         pass: environment.SMTP_USER_PASSWORD
//     }
// });

module.exports.ViewOption = (transport, hbs) => {
    transport.use('compile', hbs({
        viewEngine: {
            extName: '.hbs',
            partialsDir: 'views/email',//your path, views is a folder inside the source folder
            layoutsDir: 'views/email',
            defaultLayout: ''//set this one empty and provide your template below,
          },
            viewPath: 'views/email',
            extName: '.hbs'
    }));
}
