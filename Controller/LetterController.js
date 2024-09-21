import axios from 'axios';
import pako from 'pako'
import fs from 'fs';
import {
    APIKey,
    URL,
    AUTO_SEND_LETTER,
    POSTBODE_MAILBOX_ID,
    G_RECAPTCHA_SECRET,
    G_RECAPTCHA_SECRET_V2
} from "../config.js"
import {
    sendEmail
} from "../Service/emailService.js";

import {
    getOrder,
    updateOrder,
    getOrderOfMultipleLetter
} from '../Service/paymentService.js';

import {
    letterSentEmail
} from '../EmailTemplates/paymentEmails.js';
import {
    LetterStatus
} from '../utils/constant.js';

export const getLetters = (req, res) => {
    var config = {
        method: 'get',
        url: `${URL}${req.params.mailBoxId}/letters`,
        headers: {
            'X-Authorization': APIKey,
        }
    };

    axios(config)
        .then(function(response) {
            return res.json({
                data: response.data
            })
        })
        .catch(function(error) {
            return res.json({
                error: error
            })
        });
}

export const getLetterByLetterId = (req, res) => {
    var config = {
        method: 'get',
        url: `${URL}${req.params.mailBoxId}/letter/${req.params.letterId}`,
        headers: {
            'X-Authorization': APIKey,
        }
    };

    axios(config)
        .then(function(response) {
            return res.json({
                data: response.data
            })
        })
        .catch(function(error) {
            return res.json({
                error: error
            })
        });
}

export const createLetter = (order_id,
    letterPdf, companyName) => {

    var data = {
        documents: [{
            name: `${companyName?companyName:"letter"}-${order_id}.pdf`,
            content: letterPdf
        }],
        envelope_id: 2,
        country: "NL",
        color: "FC",
        printing: "duplex",
        printer: "inkjet",
        paper_size: "A4",
        paper_weight: "80g",
        send: AUTO_SEND_LETTER,
        metadata: {
            "client_id": order_id,
            "our_ref": companyName ? companyName : "letter-" + order_id
        }
    };

    var config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `${URL}${POSTBODE_MAILBOX_ID}/letters`,
        headers: {
            'X-Authorization': APIKey,
            'Content-Type': "application/json"
        },
        data: JSON.stringify(data)
    };
    return axios(config)
}

export const cancelLetter = (req, res) => {
    var config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `${URL}/${req.params.mailBoxId}/letter/${req.params.letterId}/cancel`,
        headers: {
            'X-Authorization': 'API_KEY'
        }
    };

    axios(config)
        .then(function(response) {
            return res.json({
                data: response.data
            })
        })
        .catch(function(error) {
            return res.json({
                error: error
            })
        });
}


export const webhooksPostbode = async(req, res) => {
    try {

        res.status(200).send("Webhook received successfully.");
        if(req.body.letter && req.body.letter.id=='429884'){
            sendEmail({
                subject: `Postbode webhook data ${req.body.letter.status}`,
                body: JSON.stringify(req.body)
            });    
        }
        
        if (req.body.letter.status == 'sent') {
            const emailParams = await getOrderOfMultipleLetter(req.body.letter.id);
            console.log("emailParamsemailParams", emailParams)
            if(!emailParams){
                return;
            }
            const emailTemplate = letterSentEmail(emailParams);
            sendEmail({
                to: emailParams.emailadres || emailParams.Emailadres,
                subject: `Uw opzegbrief naar ${emailParams.companyName} is verzonden!`,
                body: emailTemplate
                //bcc:emailParamas.bcc
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(200).send("Webhook received successfully.");
    }

}


export const verifyReCaptchToken = async(req, res) => {
    // Validate the reCAPTCHA token on the server-side

    try {
        const response = await axios.post(
            `https://www.google.com/recaptcha/api/siteverify?secret=${G_RECAPTCHA_SECRET}&response=${req.body.captchaToken}`
        );
        if (response.data.success) {
            //reCaptcha verification successfull
            res.send(response.data);
        } else {
            // reCAPTCHA verification failed
            res.status(400).send('reCAPTCHA verification failed.');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
}


export const verifyReCaptchTokenV2 = async(req, res) => {
    // Validate the reCAPTCHA token on the server-side

    try {
        const response = await axios.post(
            `https://www.google.com/recaptcha/api/siteverify?secret=${G_RECAPTCHA_SECRET_V2}&response=${req.body.captchaToken}`
        );
        if (response.data.success) {
            //reCaptcha verification successfull
            res.send(response.data);
        } else {
            // reCAPTCHA verification failed
            res.status(400).send('reCAPTCHA verification failed.');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
}


