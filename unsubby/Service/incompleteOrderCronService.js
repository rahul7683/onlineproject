 import {
     CronJob
 } from 'cron';;

 import OrderService from '../../Service/orderService.js';
 import {
     UNSUBBY_WEBSITE,
     ABBOSTOP_WEBSITE
 } from '../../config.js';
 import {
     SupportEmail,
 } from '../../utils/constant.js';
 import EmailTemplate from '../EmailTemplates/index.js';
 import moment from 'moment';
 import {
     sendErrorNotification,
     formateCompanyNames     
 } from '../../Service/commonService.js';

 async function incompleteOrderReminder() {

     //Run every 15 mins
     const job = new CronJob(
         '*/1 * * * *',
         async function() {
             try {
                 //fetch all the orders whos is failed today
                 const condition = {
                    completeOrderReminder : {$exists:false},
                     createdAt: {
                         $gte: moment().subtract(15, 'minutes').startOf('minute'),
                         $lte: moment().subtract(15, 'minutes').endOf('minute'),
                     },
                     countryCode : { $ne:'nl' },
                     letterContent : { $exists:true },
                     'letterContent.Emailadres':{ $ne:'' }                   
                 }
                 console.log('condition***************', condition);
                 const orders = await OrderService.findCookieOrder(condition);
                 for (const order of orders) {
                    if(order.letterContent && order.letterContent.Emailadres){
                        const orderExists = await OrderService.findOne({'letterContent.Emailadres':order.letterContent.Emailadres,'companies.0.company':order.companies[0].company},{orderId:1})
                         if(!orderExists){
                            await sendEmailForCompleteOrder(order)   
                         }
                     } 
                     
                 }
                 console.log('incompleteOrderReminder email reminder job running');
             } catch (error) {
                 console.error('Error in incompleteOrderReminder cron job', error);
                 sendErrorNotification('Error in incompleteOrderReminder cron job', error);

             }
         },
         null,
         true,
         'America/New_York'
     );


     //Run every day at 10 am USA
     const job2 = new CronJob(
         '10 11 * * *',
         async function() {
             try {
                 //fetch all the orders whos is failed today
                 const condition = {                     
                     "$or": [{
                         "$and": [{
                             createdAt: {
                                 $gte: moment().subtract(1, 'days').startOf('day'),
                                 $lte: moment().subtract(1, 'days').endOf('day')
                             }
                         }, {
                             "completeOrderReminder": 1
                         }]
                     }, {
                         "$and": [{
                             createdAt: {
                                 $gte: moment().subtract(3, 'days').startOf('day'),
                                 $lte: moment().subtract(3, 'days').endOf('day')
                             }
                         }, {
                             "completeOrderReminder": 2
                         }]
                     }],                     
                     countryCode : { $ne:'nl' },
                     letterContent : { $exists:true },  
                     'letterContent.Emailadres' : { $ne:'' }
                 }
                 const orders = await OrderService.findCookieOrder(condition);
                 for (const order of orders) {
                    if(order.letterContent && order.letterContent.Emailadres){                        
                        await sendEmailForCompleteOrder(order);                       
                    }
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

     return new Promise((resolve) => {
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
             }
             if (order.completeOrderReminder) {
                 reminderCount += 1;
             }
             const websiteUrl = order.countryCode == 'nl' ? ABBOSTOP_WEBSITE : `${UNSUBBY_WEBSITE}/${order.languageCode}-${order.countryCode}`;

             EmailTemplate.getEmailFromDB(order.languageCode, {
                 type: "InCompleteOrderReminder",
                 name: reminderEmailName,
                 countryCode: order.countryCode,
                 to: emailParams.Emailadres,
                 companyName: emailParams.companyName
             }, {
                 firstName: emailParams.voornaam,
                 //amount: emailParams.reminderAmount,
                 cancelLink: `${websiteUrl}/${order.companies[0].route}`,
                 supportEmail: SupportEmail[order.countryCode],
                 companyName: emailParams.companyName,
                 //orderAmount: emailParams.orderAmount
             });

             OrderService.updateCookieOrder({
                 _id: order._id
             }, {
                 completeOrderReminder: reminderCount
             })

         } catch (error) {
             console.error("Error in cron sendEmailForInCompleteOrder", error);
             sendErrorNotification('Error in sendEmailForInCompleteOrder ' + order.orderId, error);
         }

         setTimeout(resolve, 1000);
     });
 }

 export {
     incompleteOrderReminder
 };