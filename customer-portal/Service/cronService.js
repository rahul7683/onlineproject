 import {
     CronJob
 } from 'cron';;
 import CustomerService from "./customerService.js";
 import {
     sendEmailUnsubby
 } from "../../Service/emailService.js";

 import {
     BankReasonCodes,
     SupportEmail,
     ReminderAmountIncreament
 } from '../../utils/constant.js';
 import EmailTemplate from '../../unsubby/EmailTemplates/index.js';
 import moment from 'moment';
 import {
     sendErrorNotification,
     formateAmountForCountry,
     formateCompanyNames,
     getSubscriptiUniqeId
 } from '../../Service/commonService.js';
 import {
     createPaymentCheckoutLink
 } from "../../Service/mollieService.js"
 import {
     ENV
 } from "../../config.js";
 async function scheduleMyUnSubbySubscriptionReminderJob() {

     const job = new CronJob(
         '0 10 * * *',
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
                         $gt: 0,
                         $lt: 5
                     },
                     emailBounced: {
                         $ne: true
                     }
                     //_id:{$gt:ObjectId('6597c42572addd6497dd899e')}
                 }
                 const chargedBackOrders = await CustomerService.find(condition);

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
                 console.log('Subscription reminder job running');
             } catch (error) {
                 console.error('Error in Subscription reminder cron job', error);
                 sendErrorNotification('Error in Subscription reminder cron job', error);

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

         let emailParams = order;
         //emailParams.orderId = order.orderId;
         let subscriptionDate = new Date(emailParams.subscriptionResponse.createdAt);
         emailParams.orderDate = `${subscriptionDate.getDate()<10?"0":""}${subscriptionDate.getDate()}-${subscriptionDate.getMonth()<9?"0":""}${subscriptionDate.getMonth() + 1}-${subscriptionDate.getFullYear()}`;

         emailParams.amount = order.subscriptionResponse.amount.value ? parseFloat(order.subscriptionResponse.amount.value) : 4.95;
         emailParams.orderAmount = formateAmountForCountry(order.countryCode, emailParams.amount);
         emailParams.uniqueId = await getSubscriptiUniqeId(order.subscriptionResponse);
         
         //update reminder count
         let updateFields = {
             reminderCount: order.reminderCount + 1,
             chargedBackUpdatedAt: moment().format('L')
         };

         let paymentParam = {...order.paymentResponse,
             redirectUrl: 'https://unsubby.com/' + order.languageCode + '-' + order.countryCode
         };

         switch (order.reminderCount) {
             case 0:
                 {
                     //const paymentCheckoutLink = await StripeService.createInvoice(order.paymentResponse.customer, StripePrices['2995'], 7);
                     let reminderAmount = emailParams.amount.toFixed(2);
                     const paymentCheckoutLink = await createPaymentCheckoutLink(reminderAmount, 'EUR', paymentParam, 7);

                     //emailParams.checkout = paymentCheckoutLink.hosted_invoice_url;
                     emailParams.checkout = paymentCheckoutLink._links.paymentLink.href;
                     emailParams.reminderAmount = formateAmountForCountry(order.countryCode, reminderAmount);
                     emailParams.type = 'reminder1';
                     let {
                         htmlContent,
                         subject
                     } = await EmailTemplate.getEmailFromDB(emailParams.languageCode, {
                         type: "SubscriptionChargeback",
                         name: "reminder1",
                         countryCode: emailParams.countryCode,
                     }, {
                         firstName: emailParams.firstName,
                         amount: emailParams.reminderAmount,
                         paymentLink: emailParams.checkout,
                         supportEmail: SupportEmail[order.countryCode],
                         subscriptionId : emailParams.uniqueId,
                         orderAmount: emailParams.orderAmount
                     });
                     if (ENV != 'production') {
                         subject = subject + ' #Chargeback1'
                     }
                     sendEmailUnsubby({
                         to: emailParams.email,
                         subject: subject,
                         body: htmlContent,
                         replyTo: SupportEmail[order.countryCode]
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
                     let reminderAmount = (emailParams.amount + ReminderAmountIncreament.Second).toFixed(2);
                     const paymentCheckoutLink = await createPaymentCheckoutLink(reminderAmount, 'EUR', paymentParam, 7);

                     //emailParams.checkout = paymentCheckoutLink.hosted_invoice_url;
                     emailParams.checkout = paymentCheckoutLink._links.paymentLink.href;
                     emailParams.reminderAmount = formateAmountForCountry(order.countryCode, reminderAmount);
                     emailParams.type = 'reminder2';
                     let {
                         htmlContent,
                         subject
                     } = await EmailTemplate.getEmailFromDB(emailParams.languageCode, {
                         type: "SubscriptionChargeback",
                         name: "reminder2",
                         countryCode: emailParams.countryCode,
                     }, {
                         firstName: emailParams.firstName,
                         amount: emailParams.reminderAmount,
                         paymentLink: emailParams.checkout,
                         supportEmail: SupportEmail[order.countryCode],
                         subscriptionId : emailParams.uniqueId,
                         orderAmount: emailParams.orderAmount
                     });
                     if (ENV != 'production') {
                         subject = subject + ' #Chargeback2'
                     }
                     sendEmailUnsubby({
                         to: emailParams.email,
                         subject: subject,
                         body: htmlContent,
                         replyTo: SupportEmail[order.countryCode]
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
                     let reminderAmount = (emailParams.amount + ReminderAmountIncreament.Second).toFixed(2);
                     const paymentCheckoutLink = await createPaymentCheckoutLink(reminderAmount, 'EUR', paymentParam, 7);
                     //emailParams.checkout = paymentCheckoutLink.hosted_invoice_url;
                     emailParams.checkout = paymentCheckoutLink._links.paymentLink.href;
                     emailParams.reminderAmount = formateAmountForCountry(order.countryCode, reminderAmount);
                     emailParams.type = 'reminder3';
                     let {
                         htmlContent,
                         subject
                     } = await EmailTemplate.getEmailFromDB(emailParams.languageCode, {
                         type: "SubscriptionChargeback",
                         name: "reminder3",
                         countryCode: emailParams.countryCode,
                     }, {
                         firstName: emailParams.firstName,
                         amount: emailParams.reminderAmount,
                         paymentLink: emailParams.checkout,
                         supportEmail: SupportEmail[order.countryCode],
                         subscriptionId : emailParams.uniqueId,
                         orderAmount: emailParams.orderAmount
                     });
                     if (ENV != 'production') {
                         subject = subject + ' #Chargeback3'
                     }
                     sendEmailUnsubby({
                         to: emailParams.email,
                         subject: subject,
                         body: htmlContent,
                         replyTo: SupportEmail[order.countryCode]
                     });
                     updateFields.paymentLink = {
                         id: paymentCheckoutLink.id,
                         url: paymentCheckoutLink.hosted_invoice_url
                     }
                     break;
                 }
         }

         CustomerService.updateOne({
             _id: order._id
         }, updateFields)

     } catch (error) {
         console.error("Error in cron sendEmailAsPerReasonCodeAndReminder", error);
         sendErrorNotification('Error in sendEmailAsPerReasonCodeAndReminder(MD06)', error);

     }
 }

 async function sendEmailForFailedPaymentAndReminder(order) {
     try {

         let emailParams = order;
         //emailParams.orderId = order.orderId;
         let subscriptionDate = new Date(emailParams.subscriptionResponse.createdAt);
         emailParams.orderDate = `${subscriptionDate.getDate()<10?"0":""}${subscriptionDate.getDate()}-${subscriptionDate.getMonth()<9?"0":""}${subscriptionDate.getMonth() + 1}-${subscriptionDate.getFullYear()}`;

         emailParams.amount = order.subscriptionResponse.amount.value ? parseFloat(order.subscriptionResponse.amount.value) : 4.95;
         emailParams.orderAmount = formateAmountForCountry(order.countryCode, emailParams.amount);
         emailParams.uniqueId = await getSubscriptiUniqeId(order.subscriptionResponse);
         //update reminder count
         let updateFields = {
             reminderCount: order.reminderCount + 1,
             failedUpdatedAt: moment().format('L')
         };

         let paymentParam = {...order.paymentResponse,
             redirectUrl: 'https://unsubby.com/' + order.languageCode + '-' + order.countryCode
         };

         switch (order.reminderCount) {
             case 0:
                 {
                     //const paymentCheckoutLink = await StripeService.createInvoice(order.paymentResponse.customer, StripePrices['4245'], 7);
                     let reminderAmount = emailParams.amount.toFixed(2);
                     const paymentCheckoutLink = await createPaymentCheckoutLink(reminderAmount, 'EUR', paymentParam, 7);
                     //emailParams.checkout = paymentCheckoutLink.hosted_invoice_url;
                     emailParams.checkout = paymentCheckoutLink._links.paymentLink.href;
                     emailParams.reminderAmount = formateAmountForCountry(order.countryCode, reminderAmount);
                     let {
                         htmlContent,
                         subject
                     } = await EmailTemplate.getEmailFromDB(emailParams.languageCode, {
                         type: "SubscriptionFailed",
                         name: "paymentReminder1",
                         countryCode: emailParams.countryCode,
                     }, {
                         firstName: emailParams.firstName,
                         amount: emailParams.reminderAmount,
                         paymentLink: emailParams.checkout,
                         supportEmail: SupportEmail[order.countryCode],
                         subscriptionId : emailParams.uniqueId,
                         orderAmount: emailParams.orderAmount
                     });
                     if (ENV != 'production') {
                         subject = subject + ' #Failed1'
                     }
                     sendEmailUnsubby({
                         to: emailParams.email,
                         subject: subject,
                         body: htmlContent,
                         replyTo: SupportEmail[order.countryCode]
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
                     let reminderAmount = (emailParams.amount + ReminderAmountIncreament.First).toFixed(2);
                     const paymentCheckoutLink = await createPaymentCheckoutLink(reminderAmount, 'EUR', paymentParam, 7);
                     //emailParams.checkout = paymentCheckoutLink.hosted_invoice_url;
                     emailParams.checkout = paymentCheckoutLink._links.paymentLink.href;
                     emailParams.reminderAmount = formateAmountForCountry(order.countryCode, reminderAmount);
                     emailParams.type = 'paymentReminder2';
                     let {
                         htmlContent,
                         subject
                     } = await EmailTemplate.getEmailFromDB(emailParams.languageCode, {
                         type: "SubscriptionFailed",
                         name: "paymentReminder2",
                         countryCode: emailParams.countryCode,
                     }, {
                         firstName: emailParams.firstName,
                         amount: emailParams.reminderAmount,
                         paymentLink: emailParams.checkout,
                         supportEmail: SupportEmail[order.countryCode],
                         subscriptionId : emailParams.uniqueId,
                         orderAmount: emailParams.orderAmount
                     });

                     if (ENV != 'production') {
                         subject = subject + ' #Failed2'
                     }
                     sendEmailUnsubby({
                         to: emailParams.email,
                         subject: subject,
                         body: htmlContent,
                         replyTo: SupportEmail[order.countryCode]
                     });
                     updateFields.paymentLink = {
                         id: paymentCheckoutLink.id,
                         url: paymentCheckoutLink.hosted_invoice_url
                     }
                     break;
                 }
             case 2:

                 {
                     let reminderAmount = (emailParams.amount + ReminderAmountIncreament.Second).toFixed(2);
                     //const paymentCheckoutLink = await StripeService.createInvoice(order.paymentResponse.customer, StripePrices['6995'], 7);
                     const paymentCheckoutLink = await createPaymentCheckoutLink(reminderAmount, 'EUR', paymentParam, 7);
                     //emailParams.checkout = paymentCheckoutLink.hosted_invoice_url;
                     emailParams.checkout = paymentCheckoutLink._links.paymentLink.href;
                     emailParams.type = 'paymentReminder3';
                     emailParams.reminderAmount = formateAmountForCountry(order.countryCode, reminderAmount);
                     let {
                         htmlContent,
                         subject
                     } = await EmailTemplate.getEmailFromDB(emailParams.languageCode, {
                         type: "SubscriptionFailed",
                         name: "paymentReminder3",
                         countryCode: emailParams.countryCode,
                     }, {
                         firstName: emailParams.firstName,
                         amount: emailParams.reminderAmount,
                         paymentLink: emailParams.checkout,
                         supportEmail: SupportEmail[order.countryCode],
                         subscriptionId : emailParams.uniqueId,
                         orderAmount: emailParams.orderAmount
                     });
                     if (ENV != 'production') {
                         subject = subject + ' #Failed3'
                     }
                     sendEmailUnsubby({
                         to: emailParams.email,
                         subject: subject,
                         body: htmlContent,
                         replyTo: SupportEmail[order.countryCode]
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
                     let reminderAmount = (emailParams.amount + ReminderAmountIncreament.Second).toFixed(2);
                     const paymentCheckoutLink = await createPaymentCheckoutLink(reminderAmount, 'EUR', paymentParam, 7);
                     //emailParams.checkout = paymentCheckoutLink.hosted_invoice_url;
                     emailParams.checkout = paymentCheckoutLink._links.paymentLink.href;
                     emailParams.reminderAmount = formateAmountForCountry(order.countryCode, reminderAmount);
                     emailParams.type = 'paymentReminder4';
                     let {
                         htmlContent,
                         subject
                     } = await EmailTemplate.getEmailFromDB(emailParams.languageCode, {
                         type: "SubscriptionFailed",
                         name: "paymentReminder4",
                         countryCode: emailParams.countryCode,
                     }, {
                         firstName: emailParams.firstName,
                         amount: emailParams.reminderAmount,
                         paymentLink: emailParams.checkout,
                         supportEmail: SupportEmail[order.countryCode],
                         subscriptionId : emailParams.uniqueId,
                         orderAmount: emailParams.orderAmount
                     });
                     if (ENV != 'production') {
                         subject = subject + ' #Failed4'
                     }
                     sendEmailUnsubby({
                         to: emailParams.email,
                         subject: subject,
                         body: htmlContent,
                         replyTo: SupportEmail[order.countryCode]
                     });
                     updateFields.paymentLink = {
                         id: paymentCheckoutLink.id,
                         url: paymentCheckoutLink.hosted_invoice_url
                     }
                     break;
                 }
         }

         CustomerService.updateOne({
             _id: order._id
         }, updateFields)

     } catch (error) {
         console.error("Error in cron sendEmailAsPerReasonCodeAndReminder", error);
         sendErrorNotification('Error in sendEmailAsPerReasonCodeAndReminder(Failed)', error);
     }
 }

 export {
     scheduleMyUnSubbySubscriptionReminderJob
 };