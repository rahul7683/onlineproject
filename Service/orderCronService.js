 import {
     CronJob
 } from 'cron';

 import {
     getFilteredOrder,
     updateOrder
 } from "../Service/paymentService.js";

 import moment from 'moment';

 import OrderService from './orderService.js';
 import {
     sendErrorNotification
 } from './commonService.js';


 // Run every month 1st 
 async function cronJobOrdeStatistics() {
     const job = new CronJob(
         '0 0 1 * *',
         async function() {
             try {

                 await updateStatisticsForAMonth('abbostop');
                 updateStatisticsForAMonth('unsubby');
                 console.log('cronJobOrdeStatistics job running');
             } catch (error) {
                 console.error('Error in cronJobOrdeStatistics running', error);
                 sendErrorNotification('Error in cronJobOrdeStatistics running', error);
             }
         },
         null,
         true,
         'Europe/Amsterdam'
     );

 }

 async function updateStatisticsForAMonth(domain = 'unsubby') {
     try {
         const lastMonthStart = moment().subtract(1, 'month').startOf('Month');
         const lastMonthEnd = moment().startOf('Month');//moment().subtract(0, 'month').startOf('Month');
         //find and delete same order
         let condition = {
             date: {
                 $lt: lastMonthEnd,
                 $gte: lastMonthStart
             },
             paymentVendor: 'stripe'
         }

         if (domain == 'abbostop') {
             condition.paymentVendor = 'mollie';
         }

         const mm = lastMonthStart.format("MMM");
         const yy = lastMonthStart.format("YYYY");
         const lastMonthOrders = await getFilteredOrder(condition);
         let sum = 0;
         lastMonthOrders.map(item => {
             if (item.paymentResponse && item.paymentResponse.amount && item.paymentResponse.amount.value) {
                 sum += parseFloat(item.paymentResponse.amount.value);
             }
         })
         const key = `${mm}-${yy}`;
         //const updateFields = `lastTweleveMonth.$.${key}`;
         //updateFields['lastTweleveMonth'].$[key]=sum;
         OrderService.updateOrderStatistics({
                 domain: domain
             }, {
                 $set: {
                     [`lastTweleveMonth.${key}`]: sum
                 }
             }, {
                 upsert: true
             }) //"multi": true

     } catch (error) {
         console.error('Error in updateStatistics fn', error);
         sendErrorNotification('Error in updateStatistics fn', error);
     }
 }
 export {
     cronJobOrdeStatistics
 };