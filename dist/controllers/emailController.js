"use strict";
exports.__esModule = true;
exports.sendEmailNewTransferDestination = exports.sendEmailNewTransferClient = exports.sendEmailCreateUser = void 0;
var nodemailer = require('nodemailer');
var dotenv = require('dotenv');
;
var handlebars = require('handlebars');
var fs = require('fs');
var dateFormat = require('dateformat');
dotenv.config();
function readHTMLFile(path, callback) {
    fs.readFile(path, { encoding: 'utf-8' }, function (err, html) {
        if (err) {
            throw err;
            callback(err);
        }
        else {
            callback(null, html);
        }
    });
}
;
function createTransport() {
    var transport = nodemailer.createTransport({
        host: process.env.HOST_EMAIL,
        port: process.env.HOST_PORT,
        auth: {
            user: process.env.USER_EMAIL,
            pass: process.env.PASS_EMAIL
        }
    });
    return transport;
}
var sendEmailCreateUser = function (user, email) {
    readHTMLFile(__dirname + '/email/new_client.html', function (err, html) {
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
        createTransport().sendMail(mailOptions, function (err, info) {
            if (err) {
                console.log(err);
            }
            else {
                console.log(info);
            }
        });
    });
};
exports.sendEmailCreateUser = sendEmailCreateUser;
var sendEmailNewTransferClient = function (user, email, date, destination, message, accountNumber, ammount, accountNumberDestination) {
    readHTMLFile(__dirname + '/email/new_transfer_client.html', function (err, html) {
        var template = handlebars.compile(html);
        var replacements = {
            username: user,
            date: dateFormat(date, "dd-mm-yyyy h:MM"),
            destination: destination,
            message: message,
            accountNumber: accountNumber,
            ammount: ammount,
            accountNumberDestination: accountNumberDestination
        };
        var htmlToSend = template(replacements);
        var mailOptions = {
            from: 'bancorcc@yahoo.com',
            to: email,
            subject: 'Comprobante de transferencia',
            html: htmlToSend
        };
        createTransport().sendMail(mailOptions, function (err, info) {
            if (err) {
                console.log(err);
            }
            else {
                console.log(info);
            }
        });
    });
};
exports.sendEmailNewTransferClient = sendEmailNewTransferClient;
var sendEmailNewTransferDestination = function (user, email, ammount, date) {
    readHTMLFile(__dirname + '/email/new_transfer_client.html', function (err, html) {
        var template = handlebars.compile(html);
        var replacements = {
            username: user,
            date: dateFormat(date, "dd-mm-yyyy h:MM"),
            ammount: ammount
        };
        var htmlToSend = template(replacements);
        var mailOptions = {
            from: 'bancorcc@yahoo.com',
            to: email,
            subject: 'Comprobante de transferencia',
            html: htmlToSend
        };
        createTransport().sendMail(mailOptions, function (err, info) {
            if (err) {
                console.log(err);
            }
            else {
                console.log(info);
            }
        });
    });
};
exports.sendEmailNewTransferDestination = sendEmailNewTransferDestination;
//# sourceMappingURL=emailController.js.map