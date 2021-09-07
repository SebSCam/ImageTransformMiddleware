const express = require('express');
const route = express.Router();
const nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'sebax9903@gmail.com',
        pass: '99032205549SEBAS'
    }
});


var mailOptions = {
    from: 'sebax9903@gmail.com',
    to: 'sebax9903@gmail.com',
    subject: 'FALLO EN EL SERVIDOR!',
    text: 'Se nos calló :('
};

// get all emails
async function serverFailed(server_failed) {
    console.log('SERVER FAILED. SENDING EMAILS... ')
    if (emails.length > 0) {
        mailOptions.text = `Hola! se le informa que el servicio alojado en el host ${server_failed} no responde.`;
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) console.log('ERROR TO SEND EMAILS')
            else console.log('SUCCESS! EMAILS SEND')
        });
    }
}

module.exports = { route, serverFailed };