 import {
     CronJob
 } from 'cron';;
 import {
     getFilteredOrder,
     updateOrder
 } from "../../Service/paymentService.js";
 import OrderService from '../../Service/orderService.js';

 import {
     SupportEmail,
 } from '../../utils/constant.js';
 import EmailTemplate from '../EmailTemplates/index.js';
 import moment from 'moment';
 import {
     sendErrorNotification,
     formateAmountForCountry,
     formateCompanyNames
 } from '../../Service/commonService.js';

 async function completeOrderReminder() {

     //Run every 15 mins
     const job = new CronJob(
         '*/1 * * * *',
         async function() {
             try {
                 //fetch all the orders whos is failed today
                 const condition = {
                     date: {
                         $gte: moment().subtract(15, 'minutes').startOf('minute'),
                         $lte: moment().subtract(15, 'minutes').endOf('minute'),
                     },
                     'paymentResponse.status': 'failed',
                     completeOrderReminder: {
                         $exists: false
                     },
                     paymentVendor: 'stripe',
                     countryCode: 'us',
                     emailBounced: {
                         $ne: true
                     },
                 }
                 console.log('condition***************', condition);
                 const orders = await getFilteredOrder(condition);
                 for (const order of orders) {
                    const orderExists = await OrderService.findOne({'paymentResponse.status':'succeeded','letterContent.Emailadres':order.letterContent.Emailadres,'companies.0.company':order.companies[0].company},{orderId:1})
                     if(!orderExists){
                        sendEmailForCompleteOrder(order)   
                     } 
                     
                 }
                 console.log('sendCompleteOrderReminder email reminder job running');
             } catch (error) {
                 console.error('Error in sendCompleteOrderReminder cron job', error);
                 sendErrorNotification('Error in completeOrderReminder cron job', error);

             }
         },
         null,
         true,
         'America/New_York'
     );


     //Run every day at 10 am USA
     const job2 = new CronJob(
         '0 10 * * *',
         async function() {
             try {
                 //fetch all the orders whos is failed today
                 const condition = {
                     'paymentResponse.status': 'failed',
                     "$or": [{
                         "$and": [{
                             date: {
                                 $gte: moment().subtract(1, 'days').startOf('day'),
                                 $lte: moment().subtract(1, 'days').endOf('day')
                             }
                         }, {
                             "completeOrderReminder": 1
                         }]
                     }, {
                         "$and": [{
                             date: {
                                 $gte: moment().subtract(3, 'days').startOf('day'),
                                 $lte: moment().subtract(3, 'days').endOf('day')
                             }
                         }, {
                             "completeOrderReminder": 2
                         }]
                     }],
                     paymentVendor: 'stripe',
                     countryCode: 'us',
                     emailBounced: {
                         $ne: true
                     }
                 }
                 const orders = await getFilteredOrder(condition);
                 for (const order of orders) {
                     sendEmailForCompleteOrder(order)
                 }
                 console.log('Payment email reminder job running');
             } catch (error) {
                 console.error('Error in reminder cron job', error);
                 sendErrorNotification('Error in reminder cron job', error);

             }
         },
         null,
         true,
         'America/New_York'
     );
     // job.start() - See note below when to use this
     //Note - In the example above, the 4th parameter of CronJob() automatically starts the job on initialization. If this parameter is falsy or not provided, the job needs to be explicitly started using job.start().    
 }

 async function sendEmailForCompleteOrder(order) {
     try {
         let emailParams = order.letterContent;
         emailParams.companyName = formateCompanyNames(order.companies, order.countryCode);
         let reminderCount = 1
         let reminderEmailName = 'firstReminderEmail';
         switch (order.completeOrderReminder) {
             case 1:
                 reminderEmailName = 'secondReminderEmail';
                 break;
             case 2:
                 //need to send after 1 day gap
                 reminderEmailName = 'thirdReminderEmail';
                 break;
                 // case 3:
                 //     reminderEmailName = 'fourthReminderEmail';
                 //     break;
                 // case 4:
                 //     reminderEmailName = 'fifthReminderEmail';
                 //     break;

         }
         if (order.completeOrderReminder) {
             reminderCount += 1;
         }

         EmailTemplate.getEmailFromDB(order.languageCode, {
             type: "CompleteOrderReminder",
             name: reminderEmailName,
             countryCode: order.countryCode,
             to: emailParams.Emailadres,
             companyName: emailParams.companyName
         }, {
             firstName: emailParams.voornaam,
             //amount: emailParams.reminderAmount,
             cancelLink: `${order.paymentResponse.cancelUrl}&orderId=${order.orderId}`,
             supportEmail: SupportEmail[order.countryCode],
             companyName: emailParams.companyName,
             //orderAmount: emailParams.orderAmount
         });

         updateOrder({
             _id: order._id
         }, {
             completeOrderReminder: reminderCount
         })

     } catch (error) {
         console.error("Error in cron sendEmailForCompleteOrder", error);
         sendErrorNotification('Error in sendEmailForCompleteOrder ' + order.orderId, error);
     }
 }

 export {
     completeOrderReminder
 };