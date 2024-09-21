import {
    createMollieClient
} from "@mollie/api-client";
import {
    MOLLIE_API_KEY,
    MOLLIE_PAY_LINK_WEBHOOK, 
    MOLLIE_API_KEY_UNSUBBY, 
    MOLLIE_WEBHOOK_URL_UNSUBBY,
    MOLLIE_WEBHOOK_URL_PAYMENT_METHOD,
    MOLLIE_WEBHOOK_ABBOSTOP_PAYMENT_METHOD,
    MOLLIE_WEBHOOK_UNSUBBY_SUBSCRIPTION_PAYMENT_LINK
} from '../config.js';

const mollieClient = createMollieClient({
    apiKey: MOLLIE_API_KEY,
});

const mollieClientUnsubby = createMollieClient({
    apiKey: MOLLIE_API_KEY_UNSUBBY,
});

import moment from 'moment';
import orderid from "order-id";

import {
    SupportEmail , CountryData
} from '../utils/constant.js';

import { sendErrorNotification} from './commonService.js';

export const createPaymentCheckoutLink = async(amount, currency = 'EUR', payment = {}, expiryDays=7) => {
    try {

        let description = payment.description;
        if (description.indexOf('ORD-') < 0 && !payment.subscriptionId) {
            description = description + ' ' + payment.metadata.orderId;
        }

    if(payment.redirectUrl){
        const createPayment = await mollieClientUnsubby.paymentLinks.create({
            amount: {
                currency: currency,
                value: amount,
            },
            redirectUrl: payment.redirectUrl?payment.redirectUrl:'https://abbostop.nl',
            description: description,
            webhookUrl: payment.subscriptionId ? MOLLIE_WEBHOOK_UNSUBBY_SUBSCRIPTION_PAYMENT_LINK : MOLLIE_PAY_LINK_WEBHOOK,            
            expiresAt : moment().add(expiryDays, 'days').utc().format("YYYY-MM-DDTHH:mm:ssZ")
        });

        return createPayment;

    }else{

        const createPayment = await mollieClient.paymentLinks.create({
            amount: {
                currency: currency,
                value: amount,
            },
            redirectUrl: payment.redirectUrl?payment.redirectUrl:'https://abbostop.nl',
            //description: payment.description+'#'+payment.metadata.orderId,
            description: description,
            webhookUrl: payment.subscriptionId ? MOLLIE_WEBHOOK_UNSUBBY_SUBSCRIPTION_PAYMENT_LINK : MOLLIE_PAY_LINK_WEBHOOK,
            expiresAt : moment().add(expiryDays, 'days').utc().format("YYYY-MM-DDTHH:mm:ssZ")
        });

        return createPayment;
    

    }       
        

    } catch (error) {
        console.error("Error in checkout link creation", error);
    }
}




export const createPaymentMollie = async(payment = {}) => {
    try {
        let order_id = 'ORD-'+orderid().generate();
        if(payment.orderId){
            order_id = payment.orderId;
        }

        let paymentDescription = "Opzegging " + payment.companyName + " via eenmalige SEPA-betaling";

        let profileClient = null;
        let countryCodeOnly = 'nl';
        if(payment.countryCodeOnly){
            countryCodeOnly = payment.countryCodeOnly;
            paymentDescription = CountryData[countryCodeOnly].paymentDescription.replace('#company',payment.companyName).replace('#orderId',order_id);            
        }

        if (countryCodeOnly != 'nl') {
            profileClient = mollieClientUnsubby;
        } else {
            profileClient = mollieClient;
        }

        

        const customer = await profileClient.customers.create({
            name: payment.voornaam + " " + payment.achternaam,
            email: payment.Email || payment.Emailadres,
        });
        const mandate = await profileClient.customerMandates.create({
            customerId: customer.id,
            method: "directdebit",
            consumerName: payment.voornaam + " " + payment.achternaam,
            consumerAccount: payment.IBAN,
            mandateReference: payment.companyName + "-MD" + order_id,
        });
        if (mandate.status == "valid") {

            const paymentResponse = await profileClient.payments.create({
                amount: {
                    currency: "EUR",
                    value: payment.amount ? payment.amount : "29.95",
                },
                description: paymentDescription,
                sequenceType: "recurring",
                customerId: customer.id,
                consumerName: payment.voornaam + " " + payment.achternaam,
                consumerAccount: payment.IBAN,
                webhookUrl: payment.metadata ? MOLLIE_WEBHOOK_URL_UNSUBBY:undefined,
                locale : CountryData[countryCodeOnly].locale,
                metadata: payment.metadata,
            });

            console.log("created payment id=================", paymentResponse.id)
            return paymentResponse;

        }
    } catch (error) {
        console.error("Error in createPaymentMollie at mollieService", error);
        let domain = 'Abbostop';
        if (payment.countryCodeOnly != 'nl') {
            domain = 'Unsubby'
        }
        sendErrorNotification(domain + ' :Error in createPaymentMollie at mollieService', error);
    }
}

export const createPaymentMethodMollie = async(payment = {}) => {
    try {
        const customer = await mollieClientUnsubby.customers.create({
            name: payment.voornaam + " " + payment.achternaam,
            email: payment.Email,
            locale:CountryData[payment.countryCode].locale
        });

        let paymentParams = {
            amount: {
                currency: payment.countryCode == 'us' ? "USD" : "EUR",
                value: payment.letterContent.amount?.toFixed(2) || "29.95",
            },
            description: payment.paymentDescription,
            customerId: customer.id,
            consumerName: payment.voornaam + " " + payment.achternaam,
            consumerAccount: payment.IBAN,
            method : payment.paymentMethods,
            webhookUrl: MOLLIE_WEBHOOK_URL_PAYMENT_METHOD,
            redirectUrl: payment.redirectUrl?payment.redirectUrl:'https://unsubby.com',
            cancelUrl : payment.cancelUrl,
            metadata: payment.metadata            
        }

        if(payment.cardToken){
            paymentParams.cardToken = payment.cardToken;
            paymentParams.sequenceType = 'first';
        }

        if(payment.paymentMethods=='paypal'){            
            paymentParams.sequenceType = 'first';
        }

        if(payment.issuer){
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
        console.error("Error in createPaymentMethodMollie creation", error);
        let domain = 'Unsubby';
        if (payment.countryCode == 'nl') {
            domain = 'Abbostop'
        }
        if (error.message && ( error.message.indexOf('The card token has already been used') <= -1 && error.message.indexOf('A psp token must start with tkn_') <= -1)) {
            sendErrorNotification(domain + ' : Error in createPaymentMethodMollie creation', error);
        }        
        return {isError:true, error:error};
    }
}

export const getPaymentDetailUnsubby = async(payment = {}) => {

    return mollieClientUnsubby.payments.get(payment.id);
}

export const getPaymentDetailAbbostop = async(payment = {}) => {

    return mollieClient.payments.get(payment.id);
}

export const getMethodDetailUnsubby = async(methodUrl, domain) => {
    //make sure you change profile    
    if (domain == 'unsubby') {
        return mollieClientUnsubby.methods.get(methodUrl);
    } else {
        return mollieClient.methods.get(methodUrl);
    }
}


export const getAllPaymentMethods = async(query) => {
    if (query.domain == 'unsubby') {
        return mollieClientUnsubby.methods.all({locale:CountryData[query.countryCode].locale});
    } else {
        return mollieClient.methods.all({locale:CountryData[query.countryCode].locale});
    }
}

export const cancelCustomerMandate = async(data) => {
    return mollieClientUnsubby.customerMandates.delete(data.mandateId, {
        customerId: data.customerId,
    });
}