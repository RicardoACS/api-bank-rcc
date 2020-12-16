const nodemailer = require('nodemailer');
const dotenv = require('dotenv');;
var handlebars = require('handlebars');
var fs = require('fs');
var dateFormat = require('dateformat');

dotenv.config();

function readHTMLFile(path: any, callback: any) {
    fs.readFile(path, { encoding: 'utf-8' }, function (err: any, html: any) {
        if (err) {
            throw err;
            callback(err);
        }
        else {
            callback(null, html);
        }
    });
};

function createTransport() {
    let transport = nodemailer.createTransport({
        host: process.env.HOST_EMAIL,
        port: process.env.HOST_PORT,
        auth: {
            user: process.env.USER_EMAIL,
            pass: process.env.PASS_EMAIL
        }
    })

    return transport;
}

export const sendEmailCreateUser = (user:any, email:any) => {
    readHTMLFile(__dirname + '/email/new_client.html', function (err: any, html: any) {
        var template = handlebars.compile(html);
        var replacements = {
            username: user
        };
        var htmlToSend = template(replacements);
        var mailOptions = {
            from: 'bancorcc@yahoo.com',
            to: email,
            subject: 'Bienvenido',
            html: htmlToSend
        };
        createTransport().sendMail(mailOptions, function (err: any, info: any) {
            if (err) {
                console.log(err)
            } else {
                console.log(info);
            }
        }
    );
    });    
}

export const sendEmailNewTransferClient = (user:any, email:any, date:any, destination:any, message:any, accountNumber:any, ammount:any, accountNumberDestination:any) => {
    readHTMLFile(__dirname + '/email/new_transfer_client.html', function (err: any, html: any) {
        var template = handlebars.compile(html);
        var replacements = {
            username: user,
            date: dateFormat(date, "dd-mm-yyyy h:MM"),
            destination,
            message,
            accountNumber,
            ammount,
            accountNumberDestination
        };
        var htmlToSend = template(replacements);
        var mailOptions = {
            from: 'bancorcc@yahoo.com',
            to: email,
            subject: 'Comprobante de transferencia',
            html: htmlToSend
        };
        createTransport().sendMail(mailOptions, function (err: any, info: any) {
            if (err) {
                console.log(err)
            } else {
                console.log(info);
            }
        }
    );
    });    
}

export const sendEmailNewTransferDestination = (user:any, email:any, ammount:any, date:any) => {
    readHTMLFile(__dirname + '/email/new_transfer_destination.html', function (err: any, html: any) {
        var template = handlebars.compile(html);
        var replacements = {
            username: user,
            date: dateFormat(date, "dd-mm-yyyy h:MM"),
            ammount,
        };
        var htmlToSend = template(replacements);
        var mailOptions = {
            from: 'bancorcc@yahoo.com',
            to: email,
            subject: 'Comprobante de transferencia',
            html: htmlToSend
        };
        createTransport().sendMail(mailOptions, function (err: any, info: any) {
            if (err) {
                console.log(err)
            } else {
                console.log(info);
            }
        }
    );
    });    
}