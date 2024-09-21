 import {
     CronJob
 } from 'cron';;
 import {
     getFilteredOrder,
     updateOrder
 } from "../Service/paymentService.js";
 import {
     sendEmail
 } from "../Service/emailService.js";
 import {
     BankReasonCodes , ReminderAmountIncreament
 } from '../utils/constant.js'

 import {
     createPaymentCheckoutLink, createPaymentMollie
 } from '../Service/mollieService.js';

 import {
     reminder1,
     reminder2,
     reminder3,
     reminder4,
     reminder5
 } from '../EmailTemplates/chargebackEmail.js';

 import {
     paymentReminder1,
     paymentReminder2,
     paymentReminder3,
     paymentReminder4,
     paymentReminder5
 } from '../EmailTemplates/paymentFailEmail.js';

 import moment from 'moment';
 import { sendErrorNotification, formateAmountForCountry, formateCompanyNames } from './commonService.js';
import fs from 'fs';
 async function scheduleChargedBackReminderJob() {

     const job = new CronJob(
         '0 9 * * *',
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
                         $gt: 0,$lt:6
                     }, 
                     paymentVendor : {$ne :'stripe'},
                     emailBounced : {$ne:true}
                 }
                 const chargedBackOrders = await getFilteredOrder(condition);
                 for (const order of chargedBackOrders) {
                     if (order.paymentResponse.details && order.paymentResponse.details.bankReasonCode) {
                         //send reminder and increase reminder count
                         if (order.paymentResponse.details.bankReasonCode == BankReasonCodes.MD06) {
                             console.log("MD06 found", order);
                             sendEmailAsPerReasonCodeAndReminder(order);

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

 async function sendEmailAsPerReasonCodeAndReminder(order) {

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
         switch (order.reminderCount) {              
             case 1:
                 {
                     let reminderAmount = (order.letterContent.amount + ReminderAmountIncreament.Second).toFixed(2); 
                     emailParams.reminderAmount = formateAmountForCountry(order.countryCode, reminderAmount);
                     const paymentCheckoutLink = await createPaymentCheckoutLink(reminderAmount, 'EUR', order.paymentResponse);
                     emailParams.checkout = paymentCheckoutLink._links.paymentLink.href;
                     const htmlContent = reminder2(emailParams);
                     console.log("remin---------")
                     sendEmail({
                         to: order.letterContent.Emailadres,
                         subject: 'INCASSOKOSTEN: Er wordt € 40,- extra in rekening gebracht',
                         body: htmlContent
                     });
                     
                     console.log("after---------")
                     updateFields.paymentLink = {
                         id: paymentCheckoutLink.id,
                         url: paymentCheckoutLink._links.paymentLink.href
                     }
                     break
                 };
             case 2:
             case 3:
             case 4:
                 {
                     let reminderAmount = (order.letterContent.amount + ReminderAmountIncreament.Second).toFixed(2); 
                     emailParams.reminderAmount = formateAmountForCountry(order.countryCode, reminderAmount);
                     const paymentCheckoutLink = await createPaymentCheckoutLink(reminderAmount, 'EUR', order.paymentResponse);
                     emailParams.checkout = paymentCheckoutLink._links.paymentLink.href;
                     const htmlContent = reminder3(emailParams);
                     sendEmail({
                         to: order.letterContent.Emailadres,
                         subject: 'LAATSTE KANS: Voorkom dat uw vordering wordt overgedragen',
                         body: htmlContent
                     });
                     updateFields.paymentLink = {
                         id: paymentCheckoutLink.id,
                         url: paymentCheckoutLink._links.paymentLink.href
                     }
                     break;
                 } 

                }

        
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
         switch (order.reminderCount) {
             case 1:

                 {
                     let reminderAmount = (order.letterContent.amount + ReminderAmountIncreament.First).toFixed(2);                   
                     emailParams.reminderAmount = formateAmountForCountry(order.countryCode, reminderAmount);

                     const paymentCheckoutLink = await createPaymentCheckoutLink(reminderAmount, 'EUR', order.paymentResponse);
                     emailParams.checkout = paymentCheckoutLink._links.paymentLink.href;
                     const htmlContent = paymentReminder2(emailParams);
                     sendEmail({
                         to: order.letterContent.Emailadres,
                         subject: 'ADMINISTRATIEKOSTEN: Er wordt € 15,- extra in rekening gebracht.',
                         body: htmlContent
                     });
                     updateFields.paymentLink = {
                         id: paymentCheckoutLink.id,
                         url: paymentCheckoutLink._links.paymentLink.href
                     }
                     break;
                 }
             case 2:

                 {
                     let reminderAmount = (order.letterContent.amount + ReminderAmountIncreament.Second).toFixed(2);                   
                     emailParams.reminderAmount = formateAmountForCountry(order.countryCode, reminderAmount);
                     const paymentCheckoutLink = await createPaymentCheckoutLink(reminderAmount, 'EUR', order.paymentResponse);
                     emailParams.checkout = paymentCheckoutLink._links.paymentLink.href;
                     const htmlContent = paymentReminder3(emailParams);
                     sendEmail({
                         to: order.letterContent.Emailadres,
                         subject: 'INCASSOKOSTEN: Er wordt € 40,- extra in rekening gebracht.',
                         body: htmlContent
                     });
                     updateFields.paymentLink = {
                         id: paymentCheckoutLink.id,
                         url: paymentCheckoutLink._links.paymentLink.href
                     }
                     break;
                 }
             case 3:
             case 4:
                 {
                     let reminderAmount = (order.letterContent.amount + ReminderAmountIncreament.Second).toFixed(2);                   
                     emailParams.reminderAmount = formateAmountForCountry(order.countryCode, reminderAmount);
                     const paymentCheckoutLink = await createPaymentCheckoutLink(reminderAmount, 'EUR', order.paymentResponse);
                     emailParams.checkout = paymentCheckoutLink._links.paymentLink.href;
                     const htmlContent = paymentReminder4(emailParams);
                     sendEmail({
                         to: order.letterContent.Emailadres,
                         subject: 'LAATSTE KANS: Voorkom dat uw vordering wordt overgedragen.',
                         body: htmlContent
                     });
                     updateFields.paymentLink = {
                         id: paymentCheckoutLink.id,
                         url: paymentCheckoutLink._links.paymentLink.href
                     }
                     break;
                 }
         }


         updateOrder({
             _id: order._id
         }, updateFields)

     } catch (error) {
         console.error("Error in cron sendEmailAsPerReasonCodeAndReminder", error);
         sendErrorNotification('Error in sendEmailAsPerReasonCodeAndReminder(Failed)',error);
     }
 }



 async function cronJobForOwnOrder() {

    const job = new CronJob(
        '*/5 08-22 * * *',
        async function() {
            try {

                fs.readFile("./Service/own-accounts.json", function(error, data) {

                    if (error) throw error;
                    let orderData = JSON.parse(data);
                    for (const [key, payment] of orderData.entries()) {
                        if (orderData[key].nextIsMe) {
                            delete orderData[key].nextIsMe
                            if (key == 12) {
                                orderData[0].nextIsMe = true;
                            } else {
                                orderData[key + 1].nextIsMe = true;
                            }
                            createPaymentMollie(payment);
                            break;
                        }
                        
                        /*if (orderData[key].isProceed == 0 && moment().hour() >= 10 && moment().hour() < 12) {
                            orderData[key].isProceed = 1;
                            createPaymentMollie(payment);
                            break;
                        }

                        if (moment().hour() >= 12 && moment().hour() < 14 && orderData[key].isProceed == 1) {
                            orderData[key].isProceed = 2;
                            createPaymentMollie(payment);
                            break;
                        }

                        if (moment().hour() >= 14 && moment().hour() < 16 && orderData[key].isProceed == 2) {
                            orderData[key].isProceed = 3;
                            createPaymentMollie(payment);
                            break;
                        }

                         if (moment().hour() >= 16 && moment().hour() < 18 && orderData[key].isProceed == 3) {
                            orderData[key].isProceed = 4;
                            createPaymentMollie(payment);
                            break;
                        }

                         if (moment().hour() >= 18 && moment().hour() < 20 && orderData[key].isProceed == 4) {
                            orderData[key].isProceed = 5;
                            createPaymentMollie(payment);
                            break;
                        }

                         if (moment().hour() >= 20 && moment().hour() < 24 && orderData[key].isProceed == 5) {
                            orderData[key].isProceed = 0;
                            createPaymentMollie(payment);
                            break;
                        }*/
                    }

                    if(orderData){
                        fs.writeFile(
                            "./Service/own-accounts.json",
                            JSON.stringify(orderData),
                            err => {
                                if (err) throw err;
                                // Success 
                                console.log("Done writing");
                            });
                    }

                    console.log('Own order job running');

                });

            } catch (error) {
                console.error('Error Own order job running', error);
                sendErrorNotification('Error in Own order job running', error);

            }
        },
        null,
        true,
        'Europe/Amsterdam'
    );
     // job.start() - See note below when to use this
     //Note - In the example above, the 4th parameter of CronJob() automatically starts the job on initialization. If this parameter is falsy or not provided, the job needs to be explicitly started using job.start().    
 }
 export {
     scheduleChargedBackReminderJob, 
     cronJobForOwnOrder
 };