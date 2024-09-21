 import {
     CronJob
 } from 'cron';;
 import {
     getFilteredOrder,
     updateOrder
 } from "../../Service/paymentService.js";
 import UnsubbyLetterService from './letterService.js';

 import moment from 'moment';

 async function retryLetterCreate() {

     const job = new CronJob(
         '0 7 * * *',
         async function() {
             try {

                 const dateOnly = moment().subtract(1, 'days').format('L');
                 //fetch all the orders whos chargedback update date has 7 days past from today
                const condition = {
                    'companies.retry': 1,
                    'companies.letterId': {
                        $exists: false
                    },
                    countryCode: {
                        $ne: 'nl'
                    },
                    $or: [{
                        "paymentResponse.status": {
                            $in: ['paid', 'succeeded', 'pending']
                        }
                    }, {
                        paymentVendor: 'subscription'
                    }]

                }
                 const retryOrder = await getFilteredOrder(condition);
                 for (const order of retryOrder) {
                     //if (order.paymentResponse && successStatus.indexOf(order.paymentResponse.status)>-1) {
                         let updateorder = await UnsubbyLetterService.sendLetters(order);
                         updateOrder({_id:order._id},{companies:updateorder.companies});
                     //}
                 }
                 console.log('scheduleUnSubbyRetryLetterJob reminder job running');
             } catch (error) {
                 console.error('Error in scheduleUnSubbyRetryLetterJob cron job', error);
                 sendErrorNotification('Error in scheduleUnSubbyRetryLetterJob cron job',error);

             }
         },
         null,
         true,
         'America/New_York'
     );
     // job.start() - See note below when to use this
     //Note - In the example above, the 4th parameter of CronJob() automatically starts the job on initialization. If this parameter is falsy or not provided, the job needs to be explicitly started using job.start().    
 }


 export {
     retryLetterCreate
 };