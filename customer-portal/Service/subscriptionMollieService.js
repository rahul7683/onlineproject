import {
    createMollieClient
} from "@mollie/api-client";
import {
    MOLLIE_API_KEY,
    MOLLIE_API_KEY_UNSUBBY,
    MOLLIE_WEBHOOK_UNSUBBY_SUBSCRIPTION,
    MOLLIE_WEBHOOK_UNSUBBY_SUBSCRIPTION_PAYMENT
} from '../../config.js';

const mollieClient = createMollieClient({
    apiKey: MOLLIE_API_KEY,
});

const mollieClientUnsubby = createMollieClient({
    apiKey: MOLLIE_API_KEY_UNSUBBY,
});

import moment from 'moment';
 import {
     sendErrorNotification
 } from '../../Service/commonService.js';

export default class SubscriptionMollieService {

    /**
     * customer object : 
     * name 
     * email
     * locale
     **/
    static async createCustomer(customer = {}) {
        return mollieClientUnsubby.customers.create(customer);
    }



    /**
     * Note : 
     * For Sepa/IBAN : Mandate is mandatory since it is reccuring
     * Creditcard : sequenceType should be first
     * Paypal : No sequesnceType require since it is not reccuiring payment
     * 
     * */
    static async createCustomerFirstPaymentSubscription(payment = {}) {
        try {

            let paymentParams = {
                amount: {
                    currency: payment.currency,
                    value: payment.amount || "4.95",
                },
                description: payment.description,
                customerId: payment.customerId,
                sequenceType: 'first',
                method: payment.paymentMethod,
                webhookUrl: MOLLIE_WEBHOOK_UNSUBBY_SUBSCRIPTION_PAYMENT,
                redirectUrl: payment.redirectUrl ? payment.redirectUrl : 'https://unsubby.com',
                cancelUrl: payment.cancelUrl,
                metadata: payment.metadata
            }


            if (payment.paymentMethod == 'directdebit') {
                const mandate = await mollieClientUnsubby.customerMandates.create({
                    customerId: payment.customerId,
                    method: payment.paymentMethod,
                    consumerName: payment.firstName,
                    consumerAccount: payment.iban,
                    mandateReference: payment.customerId + '-SUB-UNSUBBY-' + Date.now()
                });
                console.log("mandate status", mandate.status);
                paymentParams.sequenceType = 'recurring';
                paymentParams.consumerAccount = payment.iban;

            }

            /*if (payment.paymentMethod == 'paypal') {
                const mandate = await mollieClientUnsubby.customerMandates.create({
                    customerId: payment.customerId,
                    method: payment.paymentMethod,
                    consumerName: payment.firstName,
                    mandateReference: payment.customerId + '-SUB-UNSUBBY-' + Date.now()
                });
                delete paymentParams.sequenceType;
            }*/



            if (payment.cardToken) {
                paymentParams.cardToken = payment.cardToken;
            }

            if (payment.issuer) {
                paymentParams.issuer = payment.issuer;
            }

            //Abbostop profile change
            if (payment.countryCode == 'nl') {
                paymentParams.webhookUrl = MOLLIE_WEBHOOK_ABBOSTOP_PAYMENT_METHOD;
                const paymentResponse = await mollieClient.payments.create(paymentParams);
                console.log("created payment id=================", paymentResponse.id)
                return paymentResponse;
            }

            const paymentResponse = await mollieClientUnsubby.payments.create(paymentParams);
            console.log("created payment id=================", paymentResponse.id)
            return paymentResponse;


        } catch (error) {
            console.error('Error in createCustomerFirstPaymentSubscription creation  '+payment.metadata.email, error);
            sendErrorNotification('Subscription : Error in subscription createCustomerFirstPaymentSubscription '+payment.metadata.email, error);

            return null;
        }
    }


    static async createCustomerSubscription(payment = {}) {
        try {

            let paymentParams = {
                amount: {
                    currency: payment.currency,
                    value: payment.amount || "4.95",
                },
                description: payment.description,
                customerId: payment.customerId,
                //times: 1, times means how many times you want to charge 
                interval: '1 months',
                method: payment.paymentMethod,
                startDate: payment.startDate ? payment.startDate : moment().add(7, 'days').utc().format("YYYY-MM-DD"),
                webhookUrl: MOLLIE_WEBHOOK_UNSUBBY_SUBSCRIPTION,
                metadata: payment.metadata

            }

            //if have multiple than pick latest payment mandateId
            if(payment.mandateId){
                paymentParams.mandateId = payment.mandateId;
                delete paymentParams.method;
            }


            // !payment.mandateId means it will pick from customer mandates
            if (payment.paymentMethod == 'directdebit' && !payment.mandateId) {
                const mandate = await mollieClientUnsubby.customerMandates.create({
                    customerId: payment.customerId,
                    method: payment.paymentMethod,
                    consumerName: payment.firstName,
                    consumerAccount: payment.iban,
                    mandateReference: payment.customerId + '-SUB-UNSUBBY-' + Date.now()
                });
                console.log("mandate status", mandate.status);
                paymentParams.mandateId = mandate.id;
                delete paymentParams.method;
            }

            if (payment.paymentMethod == 'paypal') {
                const mandate = await mollieClientUnsubby.customerMandates.create({
                    customerId: payment.customerId,
                    method: payment.paymentMethod,
                    consumerName: payment.firstName,
                    mandateReference: payment.customerId + '-SUB-UNSUBBY-' + Date.now()
                });
                delete paymentParams.sequenceType;
                paymentParams.mandateId = mandate.id;
                delete paymentParams.method;
            }

           
            //Abbostop profile change
            if (payment.countryCode == 'nl') {
                paymentParams.webhookUrl = MOLLIE_WEBHOOK_ABBOSTOP_SUBSCRIPTION;
                const paymentResponse = await mollieClient.customerSubscriptions.create(paymentParams);
                console.log("created payment id=================", paymentResponse.id)
                return paymentResponse;
            }

            const paymentResponse = await mollieClientUnsubby.customerSubscriptions.create(paymentParams);
            console.log("created payment id=================", paymentResponse.id)
            return paymentResponse;


        } catch (error) {
            console.error("Error in createCustomerSubscription creation "+payment.metadata.email, error);
            if(error.message.indexOf('The bank account is invalid')<0){
                sendErrorNotification('Subscription : Error in subscription createCustomerSubscription '+payment.metadata.email, error);    
            }            
            return { error : true , message : error.message};
        }
    }


    static async getSubscriptionDetailUnsubby(payment = {}) {

         return mollieClientUnsubby.customerSubscriptions.get(payment.subscriptionId,{
             customerId: payment.customerId
         });

        //get all subscrition list
        //return mollieClientUnsubby.customerSubscriptions.all({
        //    customerId: payment.customerId
        //});
    }

    static async cancelSubscription(payment = {}) {

        return mollieClientUnsubby.customerSubscriptions.delete(payment.id, {
            customerId: payment.customerId,
        });

    }

    static async getCustomerMandateDetail(payment = {}) {

        return mollieClientUnsubby.customerMandates.get(payment.mandateId,{
            customerId: payment.customerId
        });

    }

    static async getPaymentLinkDetail(link = {}) {
        return mollieClientUnsubby.paymentLinks.get(link.id);;
    }
}