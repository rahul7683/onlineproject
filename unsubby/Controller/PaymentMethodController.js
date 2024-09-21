import {
    LETTER_DOWNLOAD_URL,
    TO_EMAILS,
    ENV, 
    UNSUBBY_WEBSITE,
    ABBOSTOP_WEBSITE
} from '../../config.js';
import {
    updateOneCompanyDyno
} from '../../Service/companyService.js';
import {
    sendErrorNotification,
    verifyReCaptchToken,
    addressValidator,
    formateAmountForCountry, 
    formateCompanyNames,
    formateIfErrorResponse
} from '../../Service/commonService.js';
import {
    uploadinS3
} from "../../Service/s3FileUploadService.js"
import fs from 'fs';
import {
    SupportEmail,
    CountryData
} from '../../utils/constant.js';
import {
    addPayment,
    getPaymentByOrderId,
    updateOrder,
    getAllOrderList,
    getAllOrder,
    getOrder,
    getFilteredOrderCount,
    updateOrderMany,
    getFilteredOrder
} from "../../Service/paymentService.js";

import {
    sendEmailUnsubby , sendEmail
} from "../../Service/emailService.js";
import ibantools from "ibantools"


import {
    createPaymentMethodMollie , getPaymentDetailUnsubby , getMethodDetailUnsubby, getAllPaymentMethods, getPaymentDetailAbbostop, cancelCustomerMandate
} from '../../Service/mollieService.js';
import orderid from "order-id";
import moment from 'moment';
import EmailTemplate from '../EmailTemplates/index.js';
//postbode letter create
import { createLetter } from "../../Controller/LetterController.js";
import { paymentConfirmationEmail } from "../../EmailTemplates/paymentEmails.js";
import UnsubbyLetterService from '../Service/letterService.js'
import OrderService from '../../Service/orderService.js'
import CustomerService from '../../customer-portal/Service/customerService.js'

export default class UnSubbyPaymentMethod {

    static async create(req, res) {

        try {
             /*if (req.body.countryCode == "en-us") {
                return res.json({
                    status: false,
                    type: "test",
                    message: "Sorry we are not accepting order, cancellation service will start soon."
                })
            }*/
            let langCodeOnly = req.body.countryCode.split('-')[0];
            let countryCodeOnly = req.body.countryCode.split('-')[1];
            let paymentVendor = 'mollie';


            const isGTokenVerified = await verifyReCaptchToken(req, 'v3', req.body.code, 1);
            if (!isGTokenVerified) {
                return res.json({
                    status: false,
                    type: "test",
                    message: "Invalid data."
                })
            }

            

            let order_id = "ORD-" + orderid().generate();
            let companyNames = req.body.companies?formateCompanyNames(req.body.companies, countryCodeOnly):req.body.companyName;

            let data = req.body.formData;

            //update old order if re-try order
            if(req.body.oldOrderId || (req.body.companies && req.body.companies.length>0)){
                updateOrderMany({ $or : [{orderId:req.body.oldOrderId},{'letterContent.Emailadres':data.Emailadres,'companies.0.company':req.body.companies[0].company}]},{completeOrderReminder:0})
            }

            data["mailboxId"] = req ?.body ?.mailboxId;
            req.body.letterContent = data;

            let paymentDescription = CountryData[countryCodeOnly].paymentDescription.replace('#company', companyNames).replace('#orderId', order_id);
            const paymentMethodText = CountryData[countryCodeOnly].paymentNames[req.body.paymentMethods];
            req.body.paymentDescription = paymentMethodText ? paymentDescription.replaceAll('#method', paymentMethodText):paymentDescription.replaceAll('#method', '');
            
            req.body.orderId = order_id;
            const websiteUrl = req.body.countryCode=='nl-nl'?ABBOSTOP_WEBSITE:`${UNSUBBY_WEBSITE}/${langCodeOnly}-${countryCodeOnly}`;
            req.body.redirectUrl = `${websiteUrl}/order/${order_id}`;
            req.body.cancelUrl = `${websiteUrl}/${req.body.cancelUrl}`;
            req.body.countryId = req.body.countryId ? req.body.countryId : '6536458a9d3c03cfc9a160bd'; //unsubby
            req.body.ipAddress = req.header('x-forwarded-for') || req.header('X-Real-IP') || req.body.ipAddress;
            let letterContent = {
                voornaam: req.body ?.formData ?.voornaam,
                achternaam: req.body ?.formData ?.achternaam,
                Adres: req.body ?.formData.Adres || req.body ?.formData.address || req.body ?.formData.adres,
                Emailadres: req.body ?.formData ?.Emailadres,
                datumdate: req.body ?.formData ?.datumdate,
                klantnummer: req.body ?.formData ?.klantnummer,
                reason: req.body ?.formData ?.reason,
            };
            req.body.countryCode = countryCodeOnly;
            req.body.languageCode = langCodeOnly;
            req.body.voornaam = letterContent.voornaam;
            req.body.achternaam = letterContent.achternaam;
            req.body.Email = letterContent.Emailadres; 

            req.body.metadata = {
                countryCode: `${langCodeOnly}-${countryCodeOnly}`,
                orderId: order_id,
                formData: req.body ?.formData,
                companyName: companyNames
            }

            if(req.body.companies && req.body.companies.length>1){
                req.body.metadata.multicancellation = 'Yes';
            }

            const payment = await createPaymentMethodMollie(req.body);
            const isErrorResponse = formateIfErrorResponse(payment,countryCodeOnly );
            if(isErrorResponse && !isErrorResponse.success){
                return res.json(isErrorResponse);
            }

            req.body.paymentResponse = payment;

            if (payment) {
                res.json({
                    status: true,
                    type: "created",
                    message: "Order created successfully",
                    data: payment,
                    order_id: order_id
                });                
            }

            if (req.body.countryCode != 'nl') {
                paymentVendor = 'stripe';
            }
            req.body.paymentVendor = paymentVendor;
            addPayment(req.body);
            if (req.body.signature) {
                //add signature                 
                OrderService.createOrderDetails({
                    orderId: req.body.orderId,
                    customerSignature: req.body.signature
                })
            }

            const thirtyMinBefore = moment().subtract(30, 'minute');
            const countOrder = await getFilteredOrderCount({
                paymentVendor: paymentVendor, //we can de also
                countryId: req.body.countryId,
                momentDate: {
                    $gte: thirtyMinBefore,
                    $lte: moment()
                }
            });
            console.log('Order count on 30 minnnnnnnn=>', countOrder);
            if (countOrder >= 40) {
                sendEmailUnsubby({
                    to: TO_EMAILS,
                    subject: 'Unsubby PPM Alert ['+countryCodeOnly+'] ! 40 order created within a 30 mins ',
                    body: `<h1>Unsubby PPM Alert [${countryCodeOnly}] ! 40 order created within a 30 mins <h1>`
                });
            }

            let companyIds = [];
            if (req.body.companies) {
                companyIds = req.body.companies.map(item => {
                    return item.company
                });
            } else {
                companyIds = [req.body.company];
            }
            updateOneCompanyDyno({
                _id: {$in:companyIds}
            }, {
                $inc: {
                    orderCount: 1
                }
            });

        } catch (error) {
            console.log('Bodyyyyyy #######################', JSON.stringify(req.body));
            console.error("Unsubby Payment Method Error", error);
            sendErrorNotification('Unsubby Payment Method: Error in create order', error);
        }

    }

    static async paymentMethodWebhook(req, res) {
        let payment = await getPaymentDetailUnsubby({
            id: req.body.id
        });
        res.status(200).send("Webhook received successfully.");
        
        let updateFields = {
            'paymentResponse.status': payment.status
        };
        if (payment.status == 'canceled' || payment.status == 'expired' || payment.status == 'failed') {
            updateFields['companies.$[].letterPdf'] = '';
        }
        updateOrder({'paymentResponse.id':payment.id}, updateFields);

        let cancelSubsciption = false;
        if (payment && payment.amountRefunded && payment.amountRefunded.value) {
            let refundAmount = parseFloat(payment.amountRefunded.value)
            if (refundAmount > 0) {
                cancelSubsciption = true;
            }            
        }

        if (payment?.amountChargedBack || payment.status == 'failed' || cancelSubsciption) {            
            //cancel mandate and subscription
            const customer = await CustomerService.findOne({'subscriptionResponse.mandateId':payment.mandateId}, {subscriptionResponse:1})
            if(customer && customer.subscriptionResponse && customer.subscriptionResponse.status=='active'){
                try{
                    await CustomerService.cancelSubscription({id:customer.subscriptionResponse.id, customerId:customer.subscriptionResponse.customerId})
                    customer.subscriptionResponse.status = 'canceled';
                    customer.markModified('subscriptionResponse');
                    await customer.save();
                }catch(canerror){
                    console.error(customer._id, canerror)
                }
            }
            if(payment.mandateId){
                cancelCustomerMandate({mandateId:payment.mandateId, customerId:payment.customerId});
            }
            return;
        }


        if (payment && payment.status == 'paid') {

            //get order only if no letter created on vendor
            let order = await getOrder({
                'paymentResponse.id': payment.id,
                'companies.letterPdf' : { $ne : ''},
                emailBounced : {$ne:true}
            });

            if(!order){
                //letter already created
                return;
            }

            let emailParams = order.letterContent;
            //Format amount field
            emailParams.amount = emailParams.amount ? emailParams.amount : 29.95;
            emailParams.amount = formateAmountForCountry(order.countryCode, emailParams.amount);

            const paymentMethod = order.paymentResponse.method;
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
                } = order.languageCode=='en'?await EmailTemplate.getEmailFromDB('en', {
                    type:"Order",
                    name:"paymentConfirmationEmail",
                    ...emailParams
                }):await EmailTemplate.getPaymentConfirmationEmail(order.languageCode, emailParams);

                sendEmailUnsubby({
                    to: order.letterContent.Emailadres,
                    subject: subject.replaceAll('{{orderId}}',order.orderId),
                    body: htmlContent,
                    replyTo: SupportEmail[order.countryCode],
                    name : 'paymentConfirmationEmail'
                });

                await order.save();

                //check if user subscribed for my unsubby subscripion
                /*if (order.doSubscription && order.countryCode=='de') {
                    CustomerService.createCustomerAndSubscription(order);
                }*/

            } catch (error) {
                console.error('Error in Payment Method letters create', error);
                sendErrorNotification('Unsubby Payment Method : Error in letters create ' + order.orderId, error);

            }

        }
    }

    static async getMollieMethodDetail(req, res) {
            try {
                const name = req.params.name;
                const include = req.params.include;
                const data = await getMethodDetailUnsubby(`${name}?include=${include}`, req.query.domain);
                return res.json({
                    status: true,
                    data: data
                });

            } catch (error) {
                console.error('Error in getMollieMethodDetail', error);
                sendErrorNotification('Unsubby Payment Method : getMollieMethodDetail', error);
                return res.json({
                    status: true,
                    data: {}
                });
            }

    }

    static async getMollieMethodAll(req, res) {
            try {
                if(!req.query.countryCode){
                    req.query.countryCode='us';
                }
                const data = await getAllPaymentMethods(req.query);
                return res.json({
                    status: true,
                    data: data
                });

            } catch (error) {
                console.error('Error in getMollieMethodAll', error);
                sendErrorNotification('Unsubby Payment Method : getMollieMethodAll', error);
                return res.json({
                    status: true,
                    data: {}
                });
            }

    }



    static async paymentMethodWebhookAbbostop(req, res) {
        let payment = await getPaymentDetailAbbostop({
            id: req.body.id
        });
        res.status(200).send("Webhook received successfully.");
        if (payment && payment.status == 'paid') {

            let order = await getOrder({
                'paymentResponse.id': payment.id,
                'companies.letterPdf' : { $ne : ''},
                emailBounced : {$ne:true}
            });

            if (!order) {
                //letter already created
                return;
            }

            //Format amount field
            order.letterContent.amount = order.letterContent.amount ? order.letterContent.amount.toLocaleString(CountryData[order.countryCode].locale.replace('_', '-')) : '29,95';
            order.letterContent.amount = order.countryCode == 'at' || order.countryCode == 'nl' ? '&euro; ' + order.letterContent.amount : order.letterContent.amount + ' &euro;';

            const paymentMethod = order.paymentResponse.method;
            order.letterContent.paymentMethod = CountryData[order.countryCode].paymentNames[paymentMethod];
            order.letterContent.paymentStatement = CountryData[order.countryCode].paymentStatement[paymentMethod];
            //paymentMethod.charAt(0).toUpperCase() + paymentMethod.slice(1);

            //Letters create part
            order = await UnsubbyLetterService.sendLetters(order);


            order.letterContent.companies = order.companies;
            order.letterContent.orderId = order.orderId;
            order.letterContent.companyName = formateCompanyNames(order.companies, order.countryCode);

            let {
                htmlContent,
                subject
            } = await paymentConfirmationEmail(order.letterContent);

            sendEmail({
                to: order.letterContent.Emailadres,
                subject: subject,
                body: htmlContent,
                name : 'paymentConfirmationEmail',
                replyTo: SupportEmail[order.countryCode]
            });

            order.paymentResponse.status = 'paid';
            order.markModified('paymentResponse');
            await order.save();

        } else {

            let updateFields = {
                'paymentResponse.status': payment.status
            };

            //In-case of multiple cancellation
            /*if (payment.status == 'canceled' || payment.status == 'expired') {
                 updateFields['companies.$[].letterPdf'] = '';
            }*/

            if (payment.status == 'canceled' || payment.status == 'expired') {
                updateFields['companies.$[].letterPdf'] = '';
            }
            updateOrder({
                'paymentResponse.id': payment.id
            }, updateFields);            
        }
    }

    static async subscriptionOrderCreate(req, res) {
        try {

            if (!req.customer || !req.customer.customerId) {
                 return res.status(401).send({
                     success: false,
                     message: "Failed , invalid user",

                 })
            }


            let langCodeOnly = req.body.countryCode.split('-')[0];
            let countryCodeOnly = req.body.countryCode.split('-')[1];
            let paymentVendor = 'subscription';

            const isGTokenVerified = await verifyReCaptchToken(req, 'v3', req.body.code, 1);
            if (!isGTokenVerified) {
                return res.json({
                    status: false,
                    type: "test",
                    message: "Invalid data."
                })
            }

            let order_id = "ORD-" + orderid().generate();
            let companyNames = req.body.companies ? formateCompanyNames(req.body.companies, countryCodeOnly) : req.body.companyName;

            let data = req.body.formData;
            req.body.letterContent = data;

            req.body.orderId = order_id;
            const websiteUrl = req.body.countryCode == 'nl-nl' ? ABBOSTOP_WEBSITE : `${UNSUBBY_WEBSITE}/${langCodeOnly}-${countryCodeOnly}`;
            //req.body.redirectUrl = `${websiteUrl}/order/${order_id}`;
            //req.body.cancelUrl = `${websiteUrl}/${req.body.cancelUrl}`;
            req.body.countryId = req.body.countryId ? req.body.countryId : '6536458a9d3c03cfc9a160bd'; //unsubby
            req.body.ipAddress = req.header('x-forwarded-for') || req.header('X-Real-IP') || req.body.ipAddress;

            req.body.countryCode = countryCodeOnly;
            req.body.languageCode = langCodeOnly;
            req.body.paymentResponse = {};
            req.body.dbCustomerId = req.customer.customerId;
            res.json({
                status: true,
                type: "created",
                message: "Order created successfully",
                data: {},
                order_id: order_id
            });

            if (req.body.countryCode != 'nl') {
                paymentVendor = 'subscription';
            }
            req.body.paymentVendor = paymentVendor;
            // if(req.body.signature){
            //     //add signature                 
            //     OrderService.createOrderDetails({orderId:req.body.orderId, customerSignature:req.body.signature})
            // }


            let order = req.body;
            /*let emailParams = order.letterContent;
            //Format amount field
            emailParams.amount = emailParams.amount ? emailParams.amount : 29.95;
            emailParams.amount = formateAmountForCountry(order.countryCode, emailParams.amount);

            const paymentMethod = "credicard";
            emailParams.paymentStatement = CountryData[order.countryCode].paymentStatement[paymentMethod];
            emailParams.paymentMethod = CountryData[order.countryCode].paymentNames[paymentMethod];

            if (order.companies && order.companies.length > 0) {
                emailParams.companyName = formateCompanyNames(order.companies, order.countryCode);
            }

            emailParams.countryCode = order.countryCode;
            emailParams.languageCode = order.languageCode;*/

            try {

                //Letters create part
                order = await UnsubbyLetterService.sendLetters(order);

                /*emailParams.companies = order.companies;
                emailParams.orderId = order.orderId;

                let {
                    htmlContent,
                    subject
                } = order.languageCode == 'en' ? await EmailTemplate.getPaymentConfirmationEmailFromDB('en', {
                    letterContent: order.letterContent,
                    type: "Order",
                    name: "paymentConfirmationEmail",
                    ...emailParams                    
                }) : await EmailTemplate.getPaymentConfirmationEmail(order.languageCode, emailParams);

                sendEmailUnsubby({
                    to: order.letterContent.Emailadres,
                    subject: subject,
                    body: htmlContent,
                    replyTo: SupportEmail[order.countryCode],
                    name: 'paymentConfirmationEmail'
                });*/

                addPayment(req.body);
                CustomerService.upateDyno({
                    _id: req.customer.customerId
                }, {
                    $inc: {
                        'credit.available': -(order.companies.length)
                    }
                });

                //await order.save();

            } catch (lettererror) {

                console.log('Bodyyyyyy #######################', JSON.stringify(req.body));
                console.error("Unsubby Subscription letter create Error"+order_id, lettererror);
                sendErrorNotification('Unsubby Subscription: Error in create letter'+order_id, lettererror);

            }
            const thirtyMinBefore = moment().subtract(30, 'minute');
            const countOrder = await getFilteredOrderCount({
                paymentVendor: paymentVendor, //we can de also
                countryId: req.body.countryId,
                momentDate: {
                    $gte: thirtyMinBefore,
                    $lte: moment()
                }
            });
            console.log('Order count on 30 minnnnnnnn=>', countOrder);
            if (countOrder >= 25) {
                sendEmailUnsubby({
                    to: TO_EMAILS,
                    subject: 'Unsubby Alert ! 25 order created within a 30 mins ',
                    body: `<h1>Unsubby Alert ! 25 order created within a 30 mins <h1>`
                });
            }

            let companyIds = [];
            if (req.body.companies) {
                companyIds = req.body.companies.map(item => {
                    return item.company
                });
            } else {
                companyIds = [req.body.company];
            }
            updateOneCompanyDyno({
                _id: {
                    $in: companyIds
                }
            }, {
                $inc: {
                    orderCount: 1
                }
            });

        } catch (error) {
            console.log('Bodyyyyyy #######################', JSON.stringify(req.body));
            console.error("Unsubby Subscription order create Error", error);
            sendErrorNotification('Unsubby Subscription: Error in create order', error);
        }

    }

}