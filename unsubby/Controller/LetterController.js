import EmailTemplate from '../EmailTemplates/index.js';
import { TO_EMAILS } from '../../config.js';

import {
    SupportEmail,
    LetterStatus,
    CountryData
} from '../../utils/constant.js';
import {
    getOrderOfMultipleLetter,
    updateOrder
} from "../../Service/paymentService.js";
import {
    sendEmailUnsubby
} from "../../Service/emailService.js";

import {
    sendErrorNotification, addDelay
} from '../../Service/commonService.js';

export default class UnSubbyLetter {

    static async mySendingBoxLetterWebhook(req, res) {
        res.status(200).send("Webhook received successfully.");
        try {
            const bodyData = req.body;
            if (bodyData.event.name == 'letter.sent') {

                const letterId = bodyData.letter._id;
                const emailParams = await getOrderOfMultipleLetter(letterId);
                if(!emailParams){
                    return;
                }
                let {
                    htmlContent,
                    subject
                } = await EmailTemplate.getLetterSentEmail(emailParams.languageCode, emailParams);
                
                sendEmailUnsubby({
                    to: emailParams.emailadres || emailParams.Emailadres,
                    subject: subject,
                    body: htmlContent,
                    replyTo: SupportEmail[emailParams.countryCode]
                        //bcc:emailParams.bcc
                });

            }

        } catch (error) {
            console.error('Error in My SendingBox Letter webhook', error);
            sendErrorNotification('Unsubby : Error in My SendingBox Letter webhook', error);
        }
    }

    static async postGridLetterWebhook(req, res) {
        res.status(200).send("Webhook received successfully.");
        try {

            console.log("bodyData", req.body);
            const bodyData = req.body;
            console.log("data", bodyData.data);
            if(bodyData.data){
                const letterId = bodyData.data.id;
                if(letterId=='letter_8bsGKkmiQ2Q7kxSjXVZJwJ'){
                    sendEmailUnsubby({to : TO_EMAILS, subject :'Postgrid webhook data : '+bodyData.data.status , body : JSON.stringify(bodyData.data) });    

                }
                let currentStatus=null
                switch(bodyData.data.status){
                    case "ready":currentStatus=LetterStatus.Created
                    break;
                    case "printing":currentStatus=LetterStatus.Printing
                    break;
                    case "processed_for_delivery":currentStatus=LetterStatus.processed_for_delivery
                    break;
                    case "deliverd":currentStatus=LetterStatus.Deliverd
                    break;
                    case "completed":currentStatus=LetterStatus.completed
                    break;
                    case "cancelled":currentStatus=LetterStatus.Cancelled
                    break;
                }
                if(currentStatus != null){
                    let findCondition = {
                        companies: {
                            $elemMatch:{
                                letterId: letterId
                            }
                        }
                    }
                   updateOrder(findCondition,{
                        'companies.$.letterStatus': currentStatus
                    })
                }
            }

            if (bodyData.data && bodyData.data.status == "processed_for_delivery") {
                const letterId = bodyData.data.id;
                let emailParams = await getOrderOfMultipleLetter(letterId,LetterStatus.Printing);
                if (!emailParams) {
                    return;
                }

                emailParams = {
                    type: "Order",
                    name: "letterSentEmail",
                    ...emailParams
                }
                let {
                    htmlContent,
                    subject
                } = await EmailTemplate.getEmailFromDB(emailParams.languageCode, emailParams);

                await addDelay(1000);
                sendEmailUnsubby({
                    to: emailParams.emailadres || emailParams.Emailadres,
                    subject: subject,
                    body: htmlContent,
                    replyTo: SupportEmail[emailParams.countryCode],
                    bcc: 'orders@unsubby.com'
                });

            }


        } catch (error) {
            console.error('Error in Postgrid Letter webhook', error);
            sendErrorNotification('Unsubby : Error in postgrid Letter webhook', error);
        }
    }

}