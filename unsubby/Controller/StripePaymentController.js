import {
    UNSUBBY_WEBSITE,
} from '../../config.js';
import StripeService from '../Service/stripeService.js';
import {
    sendErrorNotification,
    verifyReCaptchToken,  
    formateAmountForCountry,
    formateCompanyNames,
    checkOrderRate,
    updateCompanyOrderCount,
    addDelay
} from '../../Service/commonService.js';

import {
    SupportEmail,
    CountryData
} from '../../utils/constant.js';
import {TimeStamp_To_yyyy_mm_dd} from "../../utils/FormatDate.js"
import {
    addPayment,    
    updateOrder,
    updateOrderMany,
    getOrder,
    getFilteredOrder
} from "../../Service/paymentService.js";

import {
    sendEmailUnsubby
} from "../../Service/emailService.js";

import orderid from "order-id";

import EmailTemplate from '../EmailTemplates/index.js';

import UnsubbyLetterService from '../Service/letterService.js'
import CustomerService from '../../customer-portal/Service/customerService.js'

export default class StripePaymentMethod {

    static async createPayment(req, res) {
        try {

            let langCodeOnly = req.body.countryCode.split('-')[0];
            let countryCodeOnly = req.body.countryCode.split('-')[1];

            const isGTokenVerified = await verifyReCaptchToken(req, 'v3', req.body.code);
            if (!isGTokenVerified) {
                return res.json({
                    status: false,
                    type: "test",
                    message: "Invalid data."
                })
            }

            let data = req.body.formData;
            const order_id = "ORD-" + orderid().generate();
            const websiteUrl = `${UNSUBBY_WEBSITE}/${langCodeOnly}-${countryCodeOnly}/`;

            //update old order if re-try order
            if(req.body.oldOrderId || (req.body.companies && req.body.companies.length>0)){
                updateOrderMany({ $or : [{orderId:req.body.oldOrderId},{'letterContent.Emailadres':data.Emailadres,'companies.0.company':req.body.companies[0].company}]},{completeOrderReminder:0})
            }

            const customer = await StripeService.createCustomer({
                name: req.body.formData.voornaam,
                email: req.body.formData.Emailadres,
                description: `Unsubby customer(${countryCodeOnly})`,
                preferred_locales: [langCodeOnly]
            });

            let companyNames = req.body.companies?formateCompanyNames(req.body.companies, countryCodeOnly):req.body.companyName;

            let paymentDescription = CountryData[countryCodeOnly].paymentDescription.replace('#company', companyNames).replace('#orderId', order_id);
            const paymentMethodText = CountryData[countryCodeOnly].paymentNames[req.body.paymentMethods];
            req.body.paymentDescription = paymentMethodText ? paymentDescription.replaceAll('#method', paymentMethodText):paymentDescription.replaceAll('#method', '');

            req.body.metadata = {
                countryCode: `${langCodeOnly}-${countryCodeOnly}`,
                orderId: order_id,
                formData: JSON.stringify(req.body.formData),
                companyName: companyNames
            }

            if (req.body.companies && req.body.companies.length > 1) {
                req.body.metadata.multicancellation = 'Yes';
            }
            const paymentData = {
                customerId: customer.id,
                description: req.body.paymentDescription,
                metadata: req.body.metadata,
                amount:req.body.formData.amount*100,
            };
            const setupIntent = await StripeService.createPaymentIntent(paymentData);
            const clientSecret = setupIntent.client_secret;
            res.send({
                status: 'Success',
                secret: clientSecret,
                order_id: order_id
            });
            setupIntent["cancelUrl"]=`${websiteUrl}/${req.body.cancelUrl}`;
            setupIntent["customerId"]=customer.id;
            //add into database
            req.body.orderId = order_id;
            req.body.customerId = customer?.id;
            req.body.paymentResponse = setupIntent;
            req.body.ipAddress = req.header('x-forwarded-for') || req.header('X-Real-IP') || req.body.ipAddress;

            req.body.letterContent = data;
            req.body.countryCode = countryCodeOnly;
            req.body.languageCode = langCodeOnly;


            req.body.paymentVendor = 'stripe';

            addPayment(req.body);

            updateCompanyOrderCount(req.body);
            checkOrderRate(req.body);

        } catch (error) {

            console.error("Error in Stripe create payment method", error);
            sendErrorNotification('Unsubby Stripe Payment Method: Error in create order', error);
        }



    }

    static async confirmPaymentIntent(req, res) {
        try {

            const payment = await StripeService.confirmIntent(req.body.paymentId);
            res.send({
                status: 'Success',
                data: payment
            });

        } catch (error) {
            res.status(500).send({
                success: false,
                message: "Error in create order",
            })
            console.error('Error in confirmPaymentIntent', error);
            sendErrorNotification('Unsubby: Error in create order', error);

        }
    }



    static async paymentWebhook(req, res) {
        console.log("reqqqqq", req.body);
        try {
            //if (ENV == 'production') {
                // sendEmailUnsubby({to : TO_EMAILS, subject :'Stripe webhook data : '+req.body.type , body : JSON.stringify(req.body) });    
            //}

            res.status(200).send("Webhook received successfully.");
            const itemObject=req.body.data.object
            const payment_intent = itemObject.payment_intent; 
            let updateDbCustomerObject={}
            let updateFields = {"paymentResponse.status":itemObject?.status};         
            if (req.body.type == 'charge.succeeded' && (itemObject?.metadata?.type !== "subscription" && itemObject.description != "Subscription creation")) {
                // updateFields.method=itemObject?.payment_method_details?.type
                let paymentMethod = itemObject?.payment_method_details?.type;
                if(itemObject?.payment_method_details[paymentMethod]?.wallet){
                    paymentMethod=itemObject?.payment_method_details[paymentMethod]?.wallet.type
                }
                updateFields["paymentResponse.method"]=paymentMethod
                updateFields["paymentResponse.payment_method_details"]=itemObject?.payment_method_details
                updateFields["paymentResponse.payment_method"]=itemObject?.payment_method

                console.log("jejejejjjjjjjjjjjjjjjjjjj",updateFields)
                updateOrder({'paymentResponse.id':payment_intent}, updateFields);

                //get order only if no letter created on vendor
                let order = await getOrder({
                    'paymentResponse.id': payment_intent,
                    'companies.letterPdf': {
                        $ne: ''
                    },
                    emailBounced: {
                        $ne: true
                    }
                });



                if (!order) {
                    //letter already created
                    return;
                }

                let emailParams = order.letterContent;
                //Format amount field
                emailParams.amount = emailParams.amount ? emailParams.amount : 29.95;
                emailParams.amount = formateAmountForCountry(order.countryCode, emailParams.amount);
                emailParams.paymentStatement = CountryData[order.countryCode].paymentStatement[paymentMethod];
                emailParams.paymentMethod = CountryData[order.countryCode].paymentNames[paymentMethod];

                //paymentMethod.charAt(0).toUpperCase() + paymentMethod.slice(1);

                //Now companyName will be multiple
                //As per task https://onlinepartnership.monday.com/boards/6428667968/pulses/6496692473         
                if (order.companies && order.companies.length > 0) {
                    emailParams.companyName = formateCompanyNames(order.companies, order.countryCode);
                }

                emailParams.countryCode = order.countryCode;
                emailParams.languageCode = order.languageCode;

                try {

                    //Letters create part
                    order = await UnsubbyLetterService.sendLetters(order);


                    emailParams.companies = order.companies;
                    emailParams.orderId = order.orderId;
                    emailParams.supportEmail = SupportEmail[order.countryCode];

                    let {
                        htmlContent,
                        subject
                    } = order.languageCode == 'en' ? await EmailTemplate.getEmailFromDB('en', {
                        type: "Order",
                        name: "paymentConfirmationEmail",
                        ...emailParams
                    }) : await EmailTemplate.getPaymentConfirmationEmail(order.languageCode, emailParams);

                    sendEmailUnsubby({
                        to: order.letterContent.Emailadres,
                        subject: subject.replaceAll('{{orderId}}', order.orderId),
                        body: htmlContent,
                        replyTo: SupportEmail[order.countryCode],
                        name: 'paymentConfirmationEmail'
                    });

                    await order.save();

                    // await updateCustomer()

                } catch (error) {
                    console.error('Error in Payment Method letters create', error);
                    sendErrorNotification('Unsubby Payment Method : Error in letters create ' + order.orderId, error);

                }

            }
           else if (req.body.type == 'charge.succeeded' && (itemObject?.metadata?.type === "subscription" || itemObject.description == "Subscription creation")) {
            let paymentMethod = itemObject?.payment_method_details?.type;
            if(itemObject?.payment_method_details[paymentMethod]?.wallet){
                paymentMethod=itemObject?.payment_method_details[paymentMethod]?.wallet.type
            }
                let StripeCustomerData = {customerId: itemObject.customer, payment_method: itemObject.payment_method, metadata: itemObject?.metadata }
                // attach payment method
                // await StripeService.updateCustomer(StripeCustomerData)

                //create subscription
                // let subscriptionResponse = await StripeService.createSubscription(StripeCustomerData)
                //update Customer
                itemObject["method"]=paymentMethod
                updateDbCustomerObject={
                    paymentResponse:itemObject,
                    mollie: {
                        customerId: itemObject.customer,
                    },
                    credit: { available: 5, used: 0 }
                }
            }else{
                updateDbCustomerObject={paymentResponse:itemObject,credit:{ available: 0, used: 0 }}
            }
            if(req.body.type == 'charge.failed' && itemObject?.metadata?.type !== "subscription"){
                updateFields['paymentResponse.failure_code']=itemObject.failure_code
                updateFields['companies.$[].letterPdf'] = '';

            }
            if(req.body.type == "charge.refund.updated" && itemObject.object == "refund" && itemObject.status == "succeeded"){
                updateFields['paymentResponse.status']="refunded";
                updateFields['paymentResponse.reason']=itemObject.reason

                let order = await getOrder({'paymentResponse.id': payment_intent});
                if(order && order?.letterContent?.Emailadres){
                  let customer = await CustomerService.findOne({email:order?.letterContent?.Emailadres}, {subscriptionResponse:1})
                  if(customer && customer.subscriptionResponse && (customer.subscriptionResponse.status == 'active'|| customer.subscriptionResponse.status == 'trialing')){
                    StripeService.cancelSubscription(customer.subscriptionResponse.id)
                    updateFields['subscriptionResponse.status'] = "canceled";
                    }
                 }
            }

            if (req.body.type == 'charge.dispute.created'){
                let order = await getOrder({'paymentResponse.id': payment_intent});
                if(order && order?.letterContent?.Emailadres){
                    let customer = await CustomerService.findOne({email:order?.letterContent?.Emailadres}, {subscriptionResponse:1})
                    if(customer && customer.subscriptionResponse && (customer.subscriptionResponse.status == 'active'|| customer.subscriptionResponse.status == 'trialing')){
                        CustomerService.updateOne({
                            _id: customer._id
                        }, {
                            'subscriptionResponse.status': 'canceled'
                        });
                        StripeService.cancelSubscription(customer.subscriptionResponse.id)
                    }
                }

            }

            if(payment_intent){
                updateOrder({'paymentResponse.id':payment_intent}, updateFields);
            }
            // subscriptionWebook update
            
            if(itemObject?.metadata?.type == "subscription" || itemObject.description == "Subscription creation"){
                const updateCustomer = await CustomerService.updateOne({
                    "paymentResponse.customer": itemObject?.customer
                },updateDbCustomerObject);
            }
    
            /*
            //const priii = await StripeService.createPrice();
            //return res.send({});
            if (req.body.type == 'charge.dispute.created' || req.body.type == 'charge.refunded' || req.body.type == 'charge.failed') {

                const payment_intent = itemObject.payment_intent;
                let updateFields = {};
                const orderDetail = await getOrder({
                    'paymentResponse.id': payment_intent
                });
                

                if(!orderDetail){
                    console.log("Order not found for stripe webhook");
                    return res.status(200).send("Webhook received successfully.");
                }

                let emailParams = orderDetail.letterContent;
                emailParams.orderId = orderDetail.orderId;
                emailParams.orderDate = `${orderDetail.date.getDate()<10?"0":""}${orderDetail.date.getDate()}-${orderDetail.date.getMonth()<9?"0":""}${orderDetail.date.getMonth() + 1}-${orderDetail.date.getFullYear()}`;
                if (!emailParams.companyName) {
                    emailParams.companyName = orderDetail.company.companyName;
                }

                let paymentCheckoutLink = {};
                //send reminder and increase reminder count
                if (req.body.type == 'charge.refunded') {
                    console.log("stripe refund reminder");
                    // Send one email immediatley 

                    paymentCheckoutLink = await StripeService.createInvoice(orderDetail.paymentResponse.customer, StripePrices['2995'], 14);
                    //paymentCheckoutLink = await createPaymentCheckoutLink('29.95', 'EUR', orderDetail.paymentResponse,14);
                    emailParams.checkout = paymentCheckoutLink.hosted_invoice_url;
                    emailParams.type = 'reminder1';
                    let { htmlContent , subject } = await EmailTemplate.getChargeBackPaymentEmails(orderDetail.countryCode, emailParams);

                    sendEmailUnsubby({
                        to: orderDetail.letterContent.Emailadres,
                        subject: subject,
                        body: htmlContent
                    });
                    console.log("Chargedback payment direct reminder sent", orderDetail.orderId);

                    updateFields.chargedBackUpdatedAt = moment().add(7, 'days').format('L');
                    updateFields.failedUpdatedAt = null;
                    updateFields['paymentResponse.status'] = 'refunded';
                    updateFields['paymentResponse.reason'] = 'refunded';
                    updateFields['paymentResponse.failure_code'] =  itemObject.failure_code || 'MD06';

                    console.log("Refund payment direct reminder sent", orderDetail.orderId);


                } else if (req.body.type == 'charge.dispute.created' || req.body.type == 'charge.failed') {
                    console.log("Stripe dispute -- failed payment")

                    const reason = req.body.data.reason || req.body.data.status;
                    // Send one email immediatley
                    paymentCheckoutLink = await StripeService.createInvoice(orderDetail.paymentResponse.customer, StripePrices['2995'], 14);
                    emailParams.checkout = paymentCheckoutLink.hosted_invoice_url;
                    emailParams.type = 'paymentReminder1';
                    updateFields.failedUpdatedAt = moment().add(7, 'days').format('L');
                    updateFields.chargedBackUpdatedAt = null;
                    updateFields['paymentResponse.status'] = itemObject.status || 'failed';
                    updateFields['paymentResponse.reason'] = itemObject.reason;
                    updateFields['paymentResponse.failure_code'] =  itemObject.failure_code || 'AC05';

                    let {htmlContent, subject} = await EmailTemplate.getFailedPaymentEmails(orderDetail.countryCode, emailParams);

                    sendEmailUnsubby({
                        to: orderDetail.letterContent.Emailadres,
                        subject: subject,
                        body: htmlContent
                    });
                    console.log("Failed payment direct reminder sent", orderDetail.orderId);
                }

                if (orderDetail.reminderCount == 0 || !orderDetail.reminderCount) {
                    updateFields.reminderCount = 1;
                }

                if (paymentCheckoutLink.id) {
                    updateFields.paymentLink = {
                        id: paymentCheckoutLink.id,
                        url: paymentCheckoutLink.hosted_invoice_url
                    }
                }

                console.log("payment response paid --------------");
                updateOrder({
                    'paymentResponse.id': payment_intent
                }, updateFields);
            }


            if (req.body.type == 'invoice.paid') {

                let updateFields = {
                    chargedBackUpdatedAt: null,
                    failedUpdatedAt: null,
                    'paymentResponse.status' : 'succeeded'
                }
                updateOrder({
                    'paymentLink.id': itemObject.id                     
                }, updateFields);

            }

            return res.status(200).send("Webhook received successfully.");
            */
        } catch (error) {
            console.error("Error in stripe payment webhook", error);
            sendErrorNotification('Unsubby : Error in stripe payment webhook', error);
        }

    
    }

    static async changePaymentWebhook(req,res){
        try{
            res.status(200).send("Webhook received successfully.");
            // sendEmailUnsubby({ to: TO_EMAILS, subject: 'Stripe session webhook data : ' + req.body.type, body: JSON.stringify(req.body) });
            const itemObject = req.body.data.object
            if (req.body.type === "checkout.session.completed") {
                let setupIntent = await StripeService.retrieveSetupIntent(itemObject.setup_intent)
                console.log(setupIntent,"setup-intent----------")
                let updateStripeCustomerData={
                    customerId:setupIntent.customer,
                    payment_method:setupIntent.payment_method
                }
               await StripeService.updateCustomer(updateStripeCustomerData)
            
               let paymentDetail=await StripeService.getPaymentDetail(setupIntent.payment_method)
               console.log(paymentDetail,"----paymentDetail-----")
               let update_payment_method_details={
                [paymentDetail.type]: paymentDetail[paymentDetail.type],
                type: paymentDetail.type
            }
               const updateCustomer = await CustomerService.updateOne({
                email: setupIntent.metadata.email
            }, {
                "subscriptionResponse.metadata.method": paymentDetail.type,
                "paymentResponse.payment_method_details":update_payment_method_details,
            });
                console.log(updateCustomer)
            }
        }catch(error){
            console.error("Error in stripe payment webhook", error);
            sendErrorNotification('Unsubby : Error in stripe payment webhook', error);
        }
    }

    static async subscriptionWebook(req,res){
        try{
            console.log("subscription Webook", req.body);
            res.status(200).send("Webhook received successfully.");
            // sendEmailUnsubby({ to: TO_EMAILS, subject: 'Stripe session webhook data : ' + req.body.type, body: JSON.stringify(req.body) });
            if (req.body.type === "customer.subscription.updated") {
                const itemObject = req.body.data.object
               let updateData ={
                    subscriptionResponse:itemObject,
                    "mollie.nextPaymentDate": TimeStamp_To_yyyy_mm_dd(itemObject.current_period_end)
                }
                if(itemObject.status == "active"){
                    updateData["credit"]={ available: 5, used: 0 }
                }
                console.log(updateData,"---update field---")
               const updateCustomer = await CustomerService.updateOne({
                email: itemObject.metadata.email
            }, updateData);
            }
        }catch(error){
            console.error("Error in subscriptionResponse webhook", error);
            sendErrorNotification('Unsubby : Error in subscriptionResponse webhook', error);
        }
    }


    static async sendToMissedEmail(req, res) {
        try {

            //418 customers
            let condition = {
                "paymentResponse.status": {
                    $in: ['pending', 'succeeded', 'paid']
                },
                //"orderId" : {$in:['ORD-1564-396985-9004']}
                date: {
                    $gte: new Date('2024-09-07T08:35:45.307+00:00'),
                    $lte: new Date('2024-09-09T08:35:45.307+00:00')
                }
            }
            const orders = await getFilteredOrder(condition);

            for (const order of orders) {

                await addDelay(300);
                let emailParams = order.letterContent;

                let paymentMethod = order.paymentResponse ?.payment_method_details ?.type;
                if (order.countryCode=='us' && order.paymentResponse ?.payment_method_details[paymentMethod] ?.wallet) {
                    paymentMethod = order.paymentResponse ?.payment_method_details[paymentMethod] ?.wallet.type
                }

                //Format amount field
                emailParams.amount = emailParams.amount ? emailParams.amount : 29.95;
                emailParams.amount = formateAmountForCountry(order.countryCode, emailParams.amount);
                emailParams.paymentStatement = CountryData[order.countryCode].paymentStatement[paymentMethod];
                emailParams.paymentMethod = CountryData[order.countryCode].paymentNames[paymentMethod];

                if (order.countryCode == 'fr') {
                    emailParams.paymentMethod = 'Prélèvement SEPA (unique)';
                } else if (order.countryCode == 'at' || order.countryCode == 'de') {
                    emailParams.paymentMethod = 'SEPA Lastschrift (einmalig)';
                }

                if (order.companies && order.companies.length > 0) {
                    emailParams.companyName = formateCompanyNames(order.companies, order.countryCode);
                }

                emailParams.countryCode = order.countryCode;
                emailParams.languageCode = order.languageCode;


                emailParams.companies = order.companies;
                emailParams.orderId = order.orderId;
                emailParams.supportEmail = SupportEmail[order.countryCode];

                let {
                    htmlContent,
                    subject
                } = order.languageCode == 'en' ? await EmailTemplate.getEmailFromDB('en', {
                    type: "Order",
                    name: "paymentConfirmationEmail",
                    ...emailParams
                }) : await EmailTemplate.getPaymentConfirmationEmail(order.languageCode, emailParams);

                sendEmailUnsubby({
                    to: order.letterContent.Emailadres,
                    subject: subject.replaceAll('{{orderId}}', order.orderId),
                    body: htmlContent,
                    replyTo: SupportEmail[order.countryCode],
                    name: 'paymentConfirmationEmail'
                });
            }

        } catch (error) {
            console.error("Error in sendToMissedEmail", error);
            //sendErrorNotification('Unsubby : Error in sendToMissedEmail stripe', error);
        }
    }
}