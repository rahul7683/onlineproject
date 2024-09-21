import Stripe from 'stripe';
import {
    STRIPE_SECRET,
    ENV
} from '../../config.js';
const stripe = new Stripe(STRIPE_SECRET);

import {
    StripePrices
} from '../../utils/constant.js';



export default class StripeService {
    static async createCustomer(params) {
        return stripe.customers.create(params);
    }

    static async updateCustomer(params) {
      return stripe.customers.update(params.customerId,  { invoice_settings: {      default_payment_method: params.payment_method,},});
    }

    static async createPaymentIntent(params) {
        return stripe.paymentIntents.create({
            amount: params.amount,
            currency: 'usd',
            // setup_future_usage:"off_session",
            // confirm: true,
            // return_url : 'https://abbostop.nl',
            customer: params.customerId,
            description : params.description,
            setup_future_usage: "off_session",
            payment_method_configuration: ENV=='production'?StripePrices.PROD_PMC:StripePrices.DEV_PMC,
            //payment_method: 'sepa_debit',

            /*payment_method_data: {
                type: 'sepa_debit',
                sepa_debit: req.body.iban,
                //{
                  //  iban: 'NL91ABNA0417164300'
                //},
                billing_details: {
                    //address : 'Test 25, 2500 PO, Amterdam',
                    name: 'Lavkesh Agrawal',
                    email: 'lavkesh@onlinepartnership.nl'
                }

            },*/

            // mandate_data : {
            //     customer_acceptance :{
            //         type  : 'online'
            //     }
            // },

            metadata: params.metadata
        });


        /* return     stripe.setupIntents.create({
  payment_method_types: ['sepa_debit'],
  customer:'cus_OypM4dXDCd6UIx',
});*/
    }


    //used into reminder payment link creation
    static async createPaymentLink(params) {
        return stripe.paymentLinks.create({
            line_items: [{
                price: 'price_1OCiokH4WIDMKylPkYx6JPJG',
                quantity: 1,
            }, ],
        });
    }

    static async getPaymentDetail(paymentMethodId) {
        return stripe.paymentMethods.retrieve(paymentMethodId);
    }

    static async createInvoice(customerId, price , dueDays) {

        const invoice = await stripe.invoices.create({
            customer: customerId,
            collection_method: 'send_invoice',
            days_until_due: dueDays,
        });

        await stripe.invoiceItems.create({
            customer: customerId,
            price: price,
            invoice: invoice.id,
        });

        return stripe.invoices.finalizeInvoice(invoice.id);
    }

    static async doVoidInvoice(invoiceId) {       

        return stripe.invoices.voidInvoice(invoiceId);
    }

    static async createPrice(params={}) {
        //price_1OCiokH4WIDMKylPkYx6JPJG
        return stripe.prices.create({
            unit_amount: 8205, // 42.45 , 69.95 // 42.05, 82.05
            currency: 'eur',
            product_data: {
                name: 'A compnay\'s subscription cancellation order via unsubby'
            }
        });
    }


    static async getPaymentIntent(id) {
        return stripe.invoices.retrieve(id);

    }

    static async confirmIntent(params) {

        //pi_3OArsuH4WIDMKylP12YoHbdA
        return stripe.paymentIntents.confirm(
            params.paymentId, {
                return_url: 'https://unsubby.com/en-us'
            }
        );

    }


    static async cancelPayment(paymentId){
           return stripe.paymentIntents.cancel(paymentId);
    }

    // subscription services

    static async createSubscription(params) {
        let reqParams={
            customer:params.customerId,
            items: [
              {
                price: ENV=='production'?StripePrices.PROD_SUBSCRIPTION_PRICE:StripePrices.DEV_SUBSCRIPTION_PRICE,
              },
            ], 
            metadata:params.metadata,
          }
          if(params.trial){
            reqParams.trial_period_days=7
          }
          if(params.subscriptionWithSignup){
            reqParams.payment_behavior= 'default_incomplete'
            reqParams.payment_settings= { save_default_payment_method: 'on_subscription' }
            reqParams.expand=['latest_invoice.payment_intent']
          }
        return await stripe.subscriptions.create(reqParams);
    }

    static async cancelSubscription(subscriptionId){
       return stripe.subscriptions.cancel(subscriptionId);
    }

    static async createCheckoutSession(params){

        let reqParams={
                payment_method_types: ['card','paypal'],
                mode: 'setup',
                customer: params.customerId,
                setup_intent_data: {
                  metadata: {
                    customer_id: params.customerId,
                    subscription_id:params.subscriptionId,
                    email:params.email
                  },
                },
                success_url: params.redirectUrl,
                cancel_url: params.redirectUrl,
                consent_collection: {
                    payment_method_reuse_agreement: {
                      position: 'hidden',
                    },
                  },
          }

         return await stripe.checkout.sessions.create(reqParams);
    }


static async retrieveSetupIntent(setupIntentId){
    return await stripe.setupIntents.retrieve(setupIntentId);
}


}