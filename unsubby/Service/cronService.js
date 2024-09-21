 import {
     CronJob
 } from 'cron';;
 import {
     getFilteredOrder,
     updateOrder
 } from "../../Service/paymentService.js";
 import {
     sendEmailUnsubby
 } from "../../Service/emailService.js";
 import {
     StripePrices
 } from '../../utils/constant.js'
import {
    BankReasonCodes
} from '../../utils/constant.js';
import {
    SupportEmail, ReminderAmountIncreament
} from '../../utils/constant.js';
 import StripeService from './stripeService.js';
 import EmailTemplate from '../EmailTemplates/index.js';
 import moment from 'moment';
 import { sendErrorNotification , formateAmountForCountry, formateCompanyNames } from '../../Service/commonService.js';
 import {createPaymentCheckoutLink} from "../../Service/mollieService.js"
import {    
    ENV    
} from "../../config.js";
 async function scheduleUnSubbyReminderJob() {

     const job = new CronJob(
         '0 8 * * *',
         async function() {
             try {

                 const dateOnly = moment().subtract(7, 'days').format('L');
                 //fetch all the orders whos chargedback update date has 7 days past from today
                 const condition = {
                     $or: [{
                         chargedBackUpdatedAt: dateOnly
                     }, {
                         failedUpdatedAt: dateOnly
                     }],
                     reminderCount: {
                         $gt : 0,$lt:5
                     }, 
                     paymentVendor : 'stripe',
                     countryCode : {$ne:'nl'},
                     emailBounced : {$ne:true}
                     //_id:{$gt:ObjectId('6597c42572addd6497dd899e')}
                 }
                 const chargedBackOrders = await getFilteredOrder(condition);
                 // for (const order of chargedBackOrders) {
                 //         //send reminder and increase reminder count
                 //         if (order.paymentResponse.status == 'refunded') {
                 //             console.log("refunded found", order);
                 //             sendEmailForChargeBackPaymentAndReminder(order);
                 //         } else if (order.paymentResponse.status == 'failed') {
                 //             sendEmailForFailedPaymentAndReminder(order);
                 //         }
                 // }


                 for (const order of chargedBackOrders) {
                     if (order.paymentResponse.details && order.paymentResponse.details.bankReasonCode) {
                         //send reminder and increase reminder count
                         if (order.paymentResponse.details.bankReasonCode == BankReasonCodes.MD06) {
                             console.log("MD06 found", order);
                             sendEmailForChargeBackPaymentAndReminder(order);

                         } else if (BankReasonCodes.FaildCodes.indexOf(order.paymentResponse.details.bankReasonCode) > -1) {
                             sendEmailForFailedPaymentAndReminder(order);
                         }
                     }
                 }
                 console.log('Payment email reminder job running');
             } catch (error) {
                 console.error('Error in reminder cron job', error);
                 sendErrorNotification('Error in reminder cron job',error);

             }
         },
         null,
         true,
         'Europe/Amsterdam'
     );
     // job.start() - See note below when to use this
     //Note - In the example above, the 4th parameter of CronJob() automatically starts the job on initialization. If this parameter is falsy or not provided, the job needs to be explicitly started using job.start().    
 }

 async function sendEmailForChargeBackPaymentAndReminder(order) {

     try {

         let emailParams = order.letterContent;
         emailParams.orderId = order.orderId;
         emailParams.orderDate = `${order.date.getDate()<10?"0":""}${order.date.getDate()}-${order.date.getMonth()<9?"0":""}${order.date.getMonth() + 1}-${order.date.getFullYear()}`
         if (!emailParams.companyName) {
             emailParams.companyName = order.company.companyName;
         }
        //Now companyName will be multiple
        //As per task https://onlinepartnership.monday.com/boards/6428667968/pulses/6496692473         
        if (order.companies && order.companies.length > 0) {
            emailParams.companyName = formateCompanyNames(order.companies, order.countryCode);
        }
        order.letterContent.amount = order.letterContent.amount ? order.letterContent.amount : 29.95;
        emailParams.countryCode = order.countryCode;
          //update reminder count
         let updateFields = {
             reminderCount: order.reminderCount+1,
             chargedBackUpdatedAt: moment().format('L')
         };

         let paymentParam = {...order.paymentResponse, redirectUrl : 'https://unsubby.com/'+order.languageCode+'-'+order.countryCode};

        
         switch (order.reminderCount) {              
            case 0:
                 {
                    //const paymentCheckoutLink = await StripeService.createInvoice(order.paymentResponse.customer, StripePrices['2995'], 7);
                    let reminderAmount = order.letterContent.amount.toFixed(2); 
                    const paymentCheckoutLink = await createPaymentCheckoutLink(reminderAmount, 'EUR', paymentParam, 7);

                     //emailParams.checkout = paymentCheckoutLink.hosted_invoice_url;
                     emailParams.checkout = paymentCheckoutLink._links.paymentLink.href;
                     emailParams.reminderAmount = formateAmountForCountry(order.countryCode, reminderAmount);
                     emailParams.type = 'reminder1';
                     let {htmlContent, subject} = await EmailTemplate.getChargeBackPaymentEmails(order.languageCode, emailParams);
                    if (ENV != 'production') {
                        subject = subject + ' #Chargeback1'
                    }
                     sendEmailUnsubby({
                         to: order.letterContent.Emailadres,
                         subject: subject,
                         body: htmlContent,
                         replyTo : SupportEmail[order.countryCode]
                     });
                     updateFields.chargedBackUpdatedAt = moment().add(7, 'days').format('L');
                     updateFields.paymentLink = {
                         id: paymentCheckoutLink.id,
                         url: paymentCheckoutLink.hosted_invoice_url
                     }
                     break
                 };
             case 1:
                 {
                     //const paymentCheckoutLink = await StripeService.createInvoice(order.paymentResponse.customer, StripePrices['2995'], 7);
                     let reminderAmount = (order.letterContent.amount + ReminderAmountIncreament.Second).toFixed(2); 
                     const paymentCheckoutLink = await createPaymentCheckoutLink(reminderAmount, 'EUR', paymentParam, 7);

                     //emailParams.checkout = paymentCheckoutLink.hosted_invoice_url;
                     emailParams.checkout = paymentCheckoutLink._links.paymentLink.href;
                     emailParams.reminderAmount = formateAmountForCountry(order.countryCode, reminderAmount);
                     emailParams.type = 'reminder2';
                     let {htmlContent, subject} = await EmailTemplate.getChargeBackPaymentEmails(order.languageCode, emailParams);
                     if (ENV != 'production') {
                        subject = subject + ' #Chargeback2'
                     }
                     sendEmailUnsubby({
                         to: order.letterContent.Emailadres,
                         subject: subject,
                         body: htmlContent,
                         replyTo : SupportEmail[order.countryCode]
                     });
                     updateFields.paymentLink = {
                         id: paymentCheckoutLink.id,
                         url: paymentCheckoutLink.hosted_invoice_url
                     }
                     break
                 };
             case 2:
             case 3:
             case 4:
                 {
                     //const paymentCheckoutLink = await StripeService.createInvoice(order.paymentResponse.customer, StripePrices['4205'], 7);
                     let reminderAmount = (order.letterContent.amount + ReminderAmountIncreament.Second).toFixed(2); 
                     const paymentCheckoutLink = await createPaymentCheckoutLink(reminderAmount, 'EUR', paymentParam, 7);
                     //emailParams.checkout = paymentCheckoutLink.hosted_invoice_url;
                     emailParams.checkout = paymentCheckoutLink._links.paymentLink.href;
                     emailParams.reminderAmount = formateAmountForCountry(order.countryCode, reminderAmount);
                     emailParams.type = 'reminder3';
                     let { htmlContent, subject }  = await EmailTemplate.getChargeBackPaymentEmails(order.languageCode, emailParams);

                     if (ENV != 'production') {
                        subject = subject + ' #Chargeback3'
                     }
                     sendEmailUnsubby({
                         to: order.letterContent.Emailadres,
                         subject: subject,
                         body: htmlContent,
                         replyTo : SupportEmail[order.countryCode]
                     });
                     updateFields.paymentLink = {
                         id: paymentCheckoutLink.id,
                         url: paymentCheckoutLink.hosted_invoice_url
                     }
                     break;
                 }  
         }

        // if (order.paymentLink && order.paymentLink.id) {
        //     StripeService.doVoidInvoice(order.paymentLink.id);
        // }
         updateOrder({
             _id: order._id
         }, updateFields)

     } catch (error) {
         console.error("Error in cron sendEmailAsPerReasonCodeAndReminder", error);
         sendErrorNotification('Error in sendEmailAsPerReasonCodeAndReminder(MD06)',error);

     }
 }

 async function sendEmailForFailedPaymentAndReminder(order) {
     try {

         let emailParams = order.letterContent;
         emailParams.orderId = order.orderId;
         emailParams.orderDate = `${order.date.getDate()<10?"0":""}${order.date.getDate()}-${order.date.getMonth()<9?"0":""}${order.date.getMonth() + 1}-${order.date.getFullYear()}`;
         if (!emailParams.companyName) {
             emailParams.companyName = order.company.companyName;
         }
        //Now companyName will be multiple
        //As per task https://onlinepartnership.monday.com/boards/6428667968/pulses/6496692473         
        if (order.companies && order.companies.length > 0) {
            emailParams.companyName = formateCompanyNames(order.companies, order.countryCode);
        }
        order.letterContent.amount = order.letterContent.amount ? order.letterContent.amount : 29.95;

         emailParams.countryCode = order.countryCode;
         //update reminder count
         let updateFields = {
             reminderCount: order.reminderCount + 1,
             failedUpdatedAt: moment().format('L')
         };

         let paymentParam = {...order.paymentResponse, redirectUrl : 'https://unsubby.com/'+order.languageCode+'-'+order.countryCode};

         switch (order.reminderCount) {
            case 0:
            {
                //const paymentCheckoutLink = await StripeService.createInvoice(order.paymentResponse.customer, StripePrices['4245'], 7);
                let reminderAmount = order.letterContent.amount.toFixed(2); 
                const paymentCheckoutLink = await createPaymentCheckoutLink(reminderAmount, 'EUR', paymentParam, 7);
                //emailParams.checkout = paymentCheckoutLink.hosted_invoice_url;
                emailParams.checkout = paymentCheckoutLink._links.paymentLink.href;
                emailParams.reminderAmount = formateAmountForCountry(order.countryCode, reminderAmount);
                emailParams.type = 'paymentReminder1';
                let { htmlContent, subject }  = await EmailTemplate.getFailedPaymentEmails(order.languageCode, emailParams);

                if (ENV != 'production') {
                    subject = subject + ' #Failed1'
                }
                sendEmailUnsubby({
                    to: order.letterContent.Emailadres,
                    subject: subject,
                    body: htmlContent,
                    replyTo : SupportEmail[order.countryCode]
                });
                updateFields.failedUpdatedAt = moment().add(7, 'days').format('L');
                updateFields.paymentLink = {
                    id: paymentCheckoutLink.id,
                    url: paymentCheckoutLink.hosted_invoice_url
                }
                break;
            }
             case 1:

                 {
                     //const paymentCheckoutLink = await StripeService.createInvoice(order.paymentResponse.customer, StripePrices['4245'], 7);
                    let reminderAmount = (order.letterContent.amount + ReminderAmountIncreament.First).toFixed(2);                   
                    const paymentCheckoutLink = await createPaymentCheckoutLink(reminderAmount, 'EUR', paymentParam, 7);
                     //emailParams.checkout = paymentCheckoutLink.hosted_invoice_url;
                     emailParams.checkout = paymentCheckoutLink._links.paymentLink.href;
                     emailParams.reminderAmount = formateAmountForCountry(order.countryCode, reminderAmount);
                     emailParams.type = 'paymentReminder2';
                     let { htmlContent, subject }  = await EmailTemplate.getFailedPaymentEmails(order.languageCode, emailParams);
                     
                    if (ENV != 'production') {
                        subject = subject + ' #Failed2'
                    }
                     sendEmailUnsubby({
                         to: order.letterContent.Emailadres,
                         subject: subject,
                         body: htmlContent,
                         replyTo : SupportEmail[order.countryCode]
                     });
                     updateFields.paymentLink = {
                         id: paymentCheckoutLink.id,
                         url: paymentCheckoutLink.hosted_invoice_url
                     }
                     break;
                 }
             case 2:

                 {
                     let reminderAmount = (order.letterContent.amount + ReminderAmountIncreament.Second).toFixed(2); 
                     //const paymentCheckoutLink = await StripeService.createInvoice(order.paymentResponse.customer, StripePrices['6995'], 7);
                     const paymentCheckoutLink = await createPaymentCheckoutLink(reminderAmount, 'EUR', paymentParam, 7);
                     //emailParams.checkout = paymentCheckoutLink.hosted_invoice_url;
                     emailParams.checkout = paymentCheckoutLink._links.paymentLink.href;
                     emailParams.type = 'paymentReminder3';
                     emailParams.reminderAmount = formateAmountForCountry(order.countryCode, reminderAmount);
                     let { htmlContent, subject }  = await EmailTemplate.getFailedPaymentEmails(order.languageCode, emailParams);

                     if (ENV != 'production') {
                        subject = subject + ' #Failed3'
                     }
                     sendEmailUnsubby({
                         to: order.letterContent.Emailadres,
                         subject: subject,
                         body: htmlContent,
                         replyTo : SupportEmail[order.countryCode]
                     });
                     updateFields.paymentLink = {
                         id: paymentCheckoutLink.id,
                         url: paymentCheckoutLink.hosted_invoice_url
                     }
                     break;
                 }
             case 3:
             case 4:
                 {
                     //const paymentCheckoutLink = await StripeService.createInvoice(order.paymentResponse.customer, StripePrices['6995'], 7);
                     let reminderAmount = (order.letterContent.amount + ReminderAmountIncreament.Second).toFixed(2); 
                     const paymentCheckoutLink = await createPaymentCheckoutLink(reminderAmount, 'EUR', paymentParam, 7);
                     //emailParams.checkout = paymentCheckoutLink.hosted_invoice_url;
                     emailParams.checkout = paymentCheckoutLink._links.paymentLink.href;
                     emailParams.reminderAmount = formateAmountForCountry(order.countryCode, reminderAmount);             
                     emailParams.type = 'paymentReminder4';
                     let { htmlContent, subject }  = await EmailTemplate.getFailedPaymentEmails(order.languageCode, emailParams);
                     
                     if (ENV != 'production') {
                        subject = subject + ' #Failed4'
                     }
                     sendEmailUnsubby({
                         to: order.letterContent.Emailadres,
                         subject: subject,
                         body: htmlContent,
                         replyTo : SupportEmail[order.countryCode]
                     });
                     updateFields.paymentLink = {
                         id: paymentCheckoutLink.id,
                         url: paymentCheckoutLink.hosted_invoice_url
                     }
                     break;
                 }
         }

        //  if (order.paymentLink && order.paymentLink.id) {
        //     StripeService.doVoidInvoice(order.paymentLink.id);
        // }
         updateOrder({
             _id: order._id
         }, updateFields)

     } catch (error) {
         console.error("Error in cron sendEmailAsPerReasonCodeAndReminder", error);
         sendErrorNotification('Error in sendEmailAsPerReasonCodeAndReminder(Failed)',error);
     }
 }

 export {
     scheduleUnSubbyReminderJob
 };