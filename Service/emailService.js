import nodemailer from 'nodemailer';
import {
    ses
} from "../middleware/MailConnection.js";

const transporter = nodemailer.createTransport({
    SES: ses
});

import {
    ENV,
    TO_EMAILS
} from '../config.js';

//@param is an object which have following properties
//to, from, replyTo, subject, body, attachment
async function sendEmail(params = {}, mailOptionsParam = null) {    

    let mailOptions = {
        from: params.from ? params.from : 'Abbo Stop <noreply@abbostop.nl>',
        replyTo: params.replyTo ? params.replyTo : "support@abbostop.nl",
        to: params.to ? params.to : TO_EMAILS,
        subject: params.subject ? params.subject : 'Default Subject',
        html: params.body ? params.body : '',
        attachments: params.attachment ? params.attachment : [{
            filename: 'AbboStop_Logo_or.png',
            path: 'https://abbostop.s3.eu-north-1.amazonaws.com/AbboStop_Logo_or.png',
            cid: 'unique@kreata.ee'
        }],
        ses: {
            ConfigurationSetName: 'Notify_bounce',
        },
        headers: {
            'x-ses-configuration-set': 'Notify_bounce',
            'bounce_watch': 'abbostop'
        }
    };

    if (params.name == 'paymentConfirmationEmail') {
        mailOptions.attachments.push({
            filename: 'Trustpilot_Logo_2022.png',
            path: 'https://abbostop.s3.eu-north-1.amazonaws.com/Trustpilot_Logo_2022.png',
            cid: 'uniqueu@kreata2.ee'
        })
    }

    //Override the mail-options if passed
    if (mailOptionsParam) {
        mailOptions = mailOptionsParam;
    }

    //add the env in subject in last like local, dev, production
    mailOptions.subject = ENV == 'production' ? `${ mailOptions.subject}` : `${ mailOptions.subject}(${ENV})`;

    if(params.bcc){
        mailOptions.bcc=params.bcc
    }   

    try {
        const response = await transporter.sendMail(mailOptions);
        return response;
    } catch (error) {
        console.error("Error sending email:", error);
        return false
    }
}

//@param is an object which have following properties
//to, from, replyTo, subject, body, attachment
async function sendEmailUnsubby(params = {}, mailOptionsParam = null) {

    let mailOptions = {
        from: params.from ? params.from : 'Unsubby <noreply@unsubby.com>',
        replyTo: params.replyTo ? params.replyTo : "support.de@unsubby.com",
        //to:'amaan@onlinepartnership.nl,mdamaan853@gmail.com,ruben@c-connect.nl',
        to: params.to ? params.to : TO_EMAILS,
        subject: params.subject ? params.subject : 'Default Subject',
        html: params.body ? params.body : '',
        attachments: params.attachment ? params.attachment : [{
            filename: 'unsubby-logo-white.png',
            path:'https://abbostop.s3.eu-north-1.amazonaws.com/unsubby-logo-white.png',
            cid: 'uniqueu@kreata1.ee'
        }
    ],
        ses: {
            ConfigurationSetName: 'Notify_bounce',
        },
        headers: {
            'x-ses-configuration-set': 'Notify_bounce',
            'bounce_watch': 'abbostop'
        }
    };

    //Override the mail-options if passed
    if (mailOptionsParam) {
        mailOptions = mailOptionsParam;
    }

    if (params.name == 'paymentConfirmationEmail') {
        mailOptions.attachments.push({
            filename: 'Trustpilot_Logo_2022.png',
            path:'https://abbostop.s3.eu-north-1.amazonaws.com/Trustpilot_Logo_2022.png',
            cid: 'uniqueu@kreata2.ee'
        })
        mailOptions.bcc='orders@unsubby.com';        
    }

    //add the env in subject in last like local, dev, production
    mailOptions.subject = ENV == 'production' ? `${ mailOptions.subject}` : `${ mailOptions.subject}(${ENV})`;

    if(params.bcc){
        mailOptions.bcc=params.bcc
    }   

    try {
        const response = await transporter.sendMail(mailOptions);
        return response;
    } catch (error) {
        console.error("Error sending email: sendEmailUnsubby "+ mailOptions.to+' '+mailOptions.subject, error);
        return false
    }
}

export {
    sendEmail,
    sendEmailUnsubby
}