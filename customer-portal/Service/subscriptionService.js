 import SubscriptionMollieService from './subscriptionMollieService.js';
 import {
     CountryData
 } from "../../utils/constant.js";
 import moment from 'moment';
 import {
     sendErrorNotification
 } from '../../Service/commonService.js';
 import {
     UNSUBBY_WEBSITE,
     ABBOSTOP_WEBSITE
 } from '../../config.js';
import StripeService from '../../unsubby/Service/stripeService.js';

 export default class SubscriptionService {

     static async createSubscription(data) {
        console.log("createSubscription called...")
         try {

             //create first payment -  \"sequenceType\": \"first\",
             // check mandate status - 
             //curl -X GET https://api.mollie.com/v2/customers/cst_4qqhO89gsT/mandates \
             // const mandate = await mollieClient.customerMandates.get('mdt_7UmCdnzAfH', {
             // customerId: 'cst_pzhEvnttJ2'})

             //use that mandate and create subscription cst_aacbfEHmz2

             //while creating subscription with diff payment method we need to cancel old one.

             let mollieCustomer = {
                 id: data.customerId
             }

             console.log("sssssssssssssss", data);
             if (!data.customerId && data.countryCode != "us") {
                 mollieCustomer = await SubscriptionMollieService.createCustomer({
                     name: data.firstName + " " + data.lastName,
                     email: data.email,
                     locale: CountryData[data.countryCode].locale
                 });
             }

             //const websiteUrl = data.countryCode=='nl'?ABBOSTOP_WEBSITE:`${UNSUBBY_WEBSITE}/${data.languageCode}-${data.countryCode}`;
             //req.body.cancelUrl = `${websiteUrl}/${req.body.cancelUrl}`;

             let subscriptionData = {
                 customerId: mollieCustomer.id,
                 amount: data.amount.toFixed(2),
                 description: CountryData[data.countryCode].subscriptionDescription+''+Date.now(),
                 cancelUrl: "https://unsubby.com",
                 currency : data.countryCode == 'us' ? 'USD' : 'EUR',
                 //cardToken: data.cardToken,
                 paymentMethod: data.paymentMethod,
                 firstName: data.lastName ? data.firstName+' '+data.lastName : data.firstName,
                 iban: data.iban,
                 startDate: data.startDate,
                 trial:data.trial,
                 //redirectUrl : data.successUrl?`${websiteUrl}${data.successUrl}`:`${websiteUrl}/my-unsubby/subscription-success`,
                 //cancelUrlUrl : data.cancelUrlUrl?`${websiteUrl}${data.cancelUrlUrl}`:`${websiteUrl}/my-unsubby/subscription-success?type=message`,
                 metadata:data.metadata ? data.metadata : {
                     domain: 'unsubby.com',
                     countryCode: `${data.languageCode}-${data.countryCode}`,
                     firstName: data.firstName,
                     email: data.email,
                     method: data.paymentMethod,
                     type:"subscription"
                 }
             }

             if(data.mandateId){
                subscriptionData.mandateId = data.mandateId;
                delete subscriptionData.paymentMethod;
             }
             let subscriptionResponse=null;
             if(data.countryCode == "us"){
                subscriptionResponse = await StripeService.createSubscription(subscriptionData);
             }else{
                 subscriptionResponse = await SubscriptionMollieService.createCustomerSubscription(subscriptionData);
             }

             return subscriptionResponse;


         } catch (error) {
             console.error("Error", error);
             sendErrorNotification('Unsubby : Error in subscription create', error);
             return null;
         }
     }

     static async createFirstPaymentSubscription(data) {
         try {

             //create first payment -  \"sequenceType\": \"first\",
             // check mandate status - 
             //curl -X GET https://api.mollie.com/v2/customers/cst_4qqhO89gsT/mandates \
             // const mandate = await mollieClient.customerMandates.get('mdt_7UmCdnzAfH', {
             // customerId: 'cst_pzhEvnttJ2'})

             //use that mandate and create subscription cst_aacbfEHmz2
             //while creating subscription with diff payment method we need to cancel old one.

             let mollieCustomer = {
                 id: data.customerId
             }

             console.log("sssssssssssssss", data.customerId);
             if (!data.customerId) {
                 mollieCustomer = await SubscriptionMollieService.createCustomer({
                     name: data.firstName + " " + data.lastName,
                     email: data.email,
                     locale: CountryData[data.countryCode].locale
                 });
             }

             const websiteUrl = data.countryCode == 'nl' ? ABBOSTOP_WEBSITE : `${UNSUBBY_WEBSITE}/${data.languageCode}-${data.countryCode}`;
             //req.body.cancelUrl = `${websiteUrl}/${req.body.cancelUrl}`;

             const firstPayment = await SubscriptionMollieService.createCustomerFirstPaymentSubscription({
                 customerId: mollieCustomer.id,
                 amount: data.amount.toFixed(2),
                 description: CountryData[data.countryCode].subscriptionDescription+''+Date.now(),
                 cancelUrl: "https://unsubby.com",
                 cardToken: data.cardToken,
                 paymentMethod: data.paymentMethod,
                 firstName: data.firstName,
                 iban: data.iban,
                 currency : data.countryCode == 'us' ? 'USD' : 'EUR',
                 redirectUrl: data.successUrl ? `${websiteUrl}${data.successUrl}?code=${data.dbCustomerId}` : `${websiteUrl}/my-unsubby/subscription-success?code=${data.dbCustomerId}`,
                 cancelUrl: data.cancelUrl ? `${websiteUrl}${data.cancelUrl}` : `${websiteUrl}/my-unsubby/subscription-success?type=message`,
                 metadata: {
                     domain: 'unsubby.com',
                     countryCode: `${data.languageCode}-${data.countryCode}`,
                     firstName: data.firstName,
                     email: data.email, 
                     method : data.paymentMethod,
                     startDate : data.startDate ? data.startDate : moment().utc().format("YYYY-MM-DD")

                 }
             })

             return firstPayment;


         } catch (error) {
             console.error("Error", error);
             sendErrorNotification('Unsubby : Error in subscription create', error);
             return null;
         }
     }


     static async cancelSubscription(data){
        return SubscriptionMollieService.cancelSubscription(data);
     }

     static async createStripeFirstPaymentSubscription(data) {
        try {
            let stripeCustomer = {
                id: data.customerId
            }

            console.log("sssssssssssssss", data.customerId);
            if (!data.customerId) {
                stripeCustomer = await StripeService.createCustomer({
                    name: data.firstName + " " + data.lastName,
                    email: data.email,
                });
            }

            const websiteUrl = `${UNSUBBY_WEBSITE}/${data.languageCode}-${data.countryCode}`;
            //req.body.cancelUrl = `${websiteUrl}/${req.body.cancelUrl}`;

            // const firstPayment = await StripeService.createPaymentIntent({
            //     customerId: stripeCustomer.id,
            //     amount:495,
            //     description:CountryData[data.countryCode].subscriptionDescription+''+Date.now(),
            //     metadata: {
            //         domain: 'unsubby.com',
            //         countryCode: `${data.languageCode}-${data.countryCode}`,
            //         firstName: data.firstName,
            //         email: data.email,
            //         type:"subscription",
            //     }
            // })

            // return firstPayment;
            let params={
                customerId: stripeCustomer.id,
                amount:CountryData[data.countryCode].myUnsubbyAmount,
                description:CountryData[data.countryCode].subscriptionDescription+''+Date.now(),
                metadata: {
                            domain: 'unsubby.com',
                            countryCode: `${data.languageCode}-${data.countryCode}`,
                            firstName: data.firstName,
                            email: data.email,
                            type:"subscription"
                        },
                  subscriptionWithSignup:true
            }

            const firstPayment = await StripeService.createSubscription(params)
            return firstPayment;


        } catch (error) {
            console.error("Error", error);
            sendErrorNotification('Unsubby : Error in subscription create', error);
            return null;
        }
    }

 }