import EmailTemplate from '../EmailTemplates/index.js';
import StripeService from '../Service/stripeService.js';
import orderid from "order-id";
import { MOLLIE_API_KEY,MOLLIE_API_KEY_UNSUBBY,  MOLLIE_WEBHOOK_URL_UNSUBBY, LETTER_DOWNLOAD_URL, TO_EMAILS, ENV } from '../../config.js';
import { updateOneCompanyDyno } from '../../Service/companyService.js';
import { StripePrices } from '../../utils/constant.js';
import moment from 'moment';
import { sendErrorNotification, verifyReCaptchToken, addressValidator , formateAmountForCountry, formateCompanyNames } from '../../Service/commonService.js';
import UnsubbyLetterService from '../Service/letterService.js';
import crypto from 'crypto';
import {
    uploadinS3
} from "../../Service/s3FileUploadService.js"
import fs from 'fs';
import {
    SupportEmail , CountryData, LetterStatus
} from '../../utils/constant.js';
import {
    addPayment,
    getPaymentByOrderId,
    updateOrder,
    getAllOrderList,
    getAllOrder,
    getOrder,
    getFilteredOrderCount,
    getFilteredOrder,
    getOrderOfMultipleLetter
} from "../../Service/paymentService.js";
import {
     sendEmailUnsubby
 } from "../../Service/emailService.js";
import ibantools from "ibantools"
import { createMollieClient } from "@mollie/api-client";
import {
     createPaymentCheckoutLink,
     cancelCustomerMandate
 } from '../../Service/mollieService.js';
import {
         BankReasonCodes
            } from '../../utils/constant.js'
const mollieClient = createMollieClient({
  apiKey: MOLLIE_API_KEY_UNSUBBY,
});

const mollieClientAbbostop = createMollieClient({
  apiKey: MOLLIE_API_KEY,
});

import OrderService from '../../Service/orderService.js';
import CustomerService from '../../customer-portal/Service/customerService.js'


export default class UnSubbyPayment {


    static async pingenWebhook(req, res) {

        let letterId = '';
        try{

            let hmac = crypto
                .createHmac(
                    "sha256",
                    "pingenwebhooksecrettest"
                )
                .update(req.body.toString())
                .digest("hex");
            if (req.headers["signature"] == hmac) {
                let bodyData = JSON.parse(req.body.toString());
                console.log('reqqqqqqq pingen webhook', bodyData, hmac, req.headers["signature"]);
                letterId  = bodyData.data?.relationships?.letter?.data?.id;
               
                if(bodyData.data.type=='webhook_sent'){

                    const emailParams = await getOrderOfMultipleLetter(letterId);
                    if(!emailParams){
                        return res.send('Pingen webhook received');
                    }
                    let {htmlContent , subject} = await EmailTemplate.getLetterSentEmail(emailParams.languageCode, emailParams);
                       sendEmailUnsubby({
                        to: emailParams.emailadres || emailParams.Emailadres,
                        subject: subject,
                        body: htmlContent,
                        replyTo : SupportEmail[emailParams.countryCode]
                        //bcc:emailParamas.bcc
                    });

                }else if(bodyData.data.type=='webhook_undeliverable'){
                    updateOrder({letterId:letterId},{letterStatus:LetterStatus.Undelivered});
                }else if(bodyData.data.type=="webhook_issues"){
                    updateOrder({letterId:letterId},{letterStatus:LetterStatus.Failed});
                }
            }

        }catch(error){
            console.error('Error in Pingin Letter webhook letterId:'+letterId, error);
            sendErrorNotification('Unsubby : Error in Pingin Letter webhook letterId:'+letterId, error);

        }

        return res.send('Pingen webhook received');

    }


    static async cancelPayment(req, res){

        try{

            if(req.body.orderIds){                

                const allOrder = await getFilteredOrder({orderId:{$in:req.body.orderIds}}, {});
                for(const order of allOrder){
                    let filename = order.letterContent.companyName + "-" + order.orderId;
                   uploadinS3(`pdf/unsubby/de/${filename}.pdf`, order.letterPdf, null,  (error, success) => {
                       console.log(success, success.Location);
                   });
                    // const letterResponse = await PingenLetter.sendLetter(order.letterContent.companyName, order.letterPdf, order.orderId); 
                    // console.log('letterResponse', letterContent);
                }
                
                return res.send('ok')
            } else if (req.body.sendLetter) {                
                const findCondition = {
                    EmailSent: false,
                    orderId: {
                        $in: ['ORD-1586-076025-0385', 'ORD-1586-074373-2373', 'ORD-1586-024108-9300', 'ORD-1586-024491-7414', 'ORD-1586-577983-4853', 'ORD-1586-579956-8299', 'ORD-1586-577133-4699', 'ORD-1586-573649-6617', 'ORD-1586-569906-3144', 'ORD-1586-598444-4519', 'ORD-1586-565579-1930', 'ORD-1586-005269-3339', 'ORD-1586-061749-9140', 'ORD-1586-066116-9291', 'ORD-1586-348407-7695', 'ORD-1586-341466-2497', 'ORD-1586-343873-3870', 'Ticket-ORD-1586-091520', 'ORD-1586-334379-1900', 'ORD-1586-336403-3651', 'ORD-1586-339036-1407', 'ORD-1586-339285-5853', 'ORD-1586-066116-9291', 'ORD-1586-306368-6019', 'ORD-1586-322041-9861', 'ORD-1586-518515-8011', 'ORD-1586-519111-6617', 'ORD-1586-515828-7889', 'ORD-1586-512031-1545', 'ORD-1586-568611-6690', 'ORD-1586-564331-7145', 'Mobilfunk-ORD-1586-563733', 'ORD-1586-006875-1171', 'ORD-1586-560497-7220', 'ORD-1586-562194-5391', 'ORD-1586-562767-1200', 'ORD-1586-598771-5123', 'ORD-1586-594414-5491', 'ORD-1586-593290-6433', 'ORD-1586-029098-5026', 'ORD-1586-592140-3465', 'ORD-1586-578901-9766', 'ORD-1586-009065-9165', 'ORD-1586-024245-7985', 'ORD-1586-578832-3426', 'ORD-1586-096535-8610', 'ORD-1586-014443-5403', 'ORD-1586-095595-4275', 'ORD-1586-005269-3339', 'ORD-1586-026801-5837', 'ORD-1586-029108-7159', 'ORD-1586-013278-3403', 'ORD-1586-015920-1766', 'ORD-1586-091689-7131', 'ORD-1586-012000-0514', 'ORD-1586-061820-7009', 'ORD-1586-579956-8299', 'ORD-1586-001353-3953', 'ORD-1586-061931-8660', 'ORD-1586-068681-5590', 'ORD-1586-061796-9953', 'ORD-1586-582596-1354', 'ORD-1586-060754-3936', 'ORD-1586-061446-7731', 'ORD-1586-066829-2827', 'ORD-1586-098890-2981', 'ORD-1586-065047-7305', 'ORD-1586-060754-3936', 'ORD-1586-024491-7414', 'ORD-1586-097350-4841', 'ORD-1586-024386-6205']
                    }
                };

                const allOrder = await getFilteredOrder(findCondition);
                for (const letterData of allOrder) {
                    if (!letterData) {
                        //return res.status(200).send("Webhook received successfully.");

                    } else {
                        let emailParamas = letterData.letterContent;
                        emailParamas.companyName = letterData.company.companyName;

                        let {
                            htmlContent,
                            subject
                        } = await EmailTemplate.getLetterSentEmail(letterData.countryCode, emailParamas);
                        letterData.EmailSent = true;
                        await letterData.save();
                        sendEmailUnsubby({
                            to: letterData.letterContent.emailadres || letterData.letterContent.Emailadres,
                            subject: subject,
                            body: htmlContent
                                //bcc:emailParamas.bcc
                        });

                    }
                }
            }
            const data = await StripeService.cancelPayment(req.body.paymentId);
            res.send(data);

        }catch(error){
            console.log("Errorrrrrr", error);
            res.send('Error')
        }

    }

    static async createPaymentMollie(req, res) {
        let langCodeOnly = req.body.countryCode.split('-')[0];
        let countryCodeOnly = req.body.countryCode.split('-')[1];
        let iban;
        try {            
            let userAddress = `${req.body?.formData.Adres || req.body?.formData.address || req.body?.formData.adres},${req.body?.formData.postcode},${req.body?.formData?.woonplaats}`
                /*let isValidAddress= await addressValidator(countryCodeOnly.toUpperCase(),userAddress)
                if(isValidAddress?.verdict?.hasUnconfirmedComponents){
                    console.log(isValidAddress?.verdict);
                    return res.json({
                        status: false,
                        type: "address",
                        message: "Uw adres is niet correct ingevuld. Controleer a.u.b. het ingevoerde adres.",
                        result: isValidAddress
                    })
                }*/

            if (req.body.countryCode == "en-us") {
                return res.json({
                    status: false,
                    type: "test",
                    message: "Invalid data."
                })
            }

            const isGTokenVerified = await verifyReCaptchToken(req, 'v3', req.body.code, 1);
            if (!isGTokenVerified) {
                return res.json({
                    status: false,
                    type: "test",
                    message: "Invalid data."
                })
            }

            iban = req.body ?.formData ?.iban.toUpperCase();
            iban = iban.replaceAll(' ', '');

            const blockedIban = ['DE73100708480513464800',
                'DE89100100100004886101',
                'DE19100500000710011679'
            ]

            if (blockedIban.indexOf(iban) > -1) {
                return res.json({
                    status: false,
                    type: "iban",
                    message: CountryData[countryCodeOnly].invalidIBANMessage
                })
            };
            delete req.body ?.formData ?.iban
            let order_id = orderid().generate();
            let amount = req.body.formData.amount;
            const customer = await mollieClient.customers.create({
                name: req.body ?.formData ?.voornaam + " " + req.body ?.formData ?.achternaam,
                email: req.body ?.formData ?.Emailadres,
                locale: CountryData[countryCodeOnly].locale
            });
            const mandate = await mollieClient.customerMandates.create({
                customerId: customer.id,
                method: "directdebit",
                consumerName: req.body ?.formData ?.voornaam + " " + req.body ?.formData ?.achternaam,
                consumerAccount: iban,
                mandateReference: req.body.companyName + "-MD" + order_id,
            });

            if (mandate.status == "valid") {
                let data = req.body.formData;
                data["mailboxId"] = req ?.body ?.mailboxId;
                // console.log(data);
                req.body.letterContent = data;
                order_id = "ORD-" + order_id;

                let companyNames = req.body.companies?formateCompanyNames(req.body.companies, countryCodeOnly):req.body.companyName;
                let paymentDescription = CountryData[countryCodeOnly].paymentDescription.replace('#company',companyNames).replace('#orderId',order_id);
                const paymentMethodText = CountryData[countryCodeOnly].paymentNames['directdebit'];
                paymentDescription = paymentMethodText ? paymentDescription.replaceAll('#method', paymentMethodText):paymentDescription.replaceAll('#method', '');

                req.body.metadata = {
                    countryCode: `${langCodeOnly}-${countryCodeOnly}`,
                    orderId: order_id,
                    formData: req.body ?.formData,
                    companyName: companyNames
                }
                if(req.body.companies && req.body.companies.length>1){
                    req.body.metadata.multicancellation = 'Yes';
                }

                const payment = await mollieClient.payments.create({
                    amount: {
                        currency: "EUR",
                        value: amount.toFixed(2),
                    },
                    description: paymentDescription,
                    sequenceType: "recurring",
                    customerId: customer ?.id,
                    consumerName: req.body ?.formData ?.voornaam + " " + req.body ?.formData ?.achternaam,
                    consumerAccount: iban,
                    webhookUrl: MOLLIE_WEBHOOK_URL_UNSUBBY,
                    locale: CountryData[countryCodeOnly].locale,
                    metadata: req.body.metadata
                });
                req.body.orderId = order_id;
                req.body.customerId = customer ?.id;
                req.body.paymentResponse = payment;
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
                    companyName: companyNames,
                    downloadUrl : 'downloadUrl',
                    orderId: order_id, 
                    countryCode : countryCodeOnly

                };
                req.body.countryCode = countryCodeOnly;
                req.body.languageCode = langCodeOnly;

                if(countryCodeOnly=='fr'){
                    letterContent.paymentMethod = 'Prélèvement SEPA (unique)';
                    letterContent.amount = '29,95 &euro;'
                }else if(countryCodeOnly=='at' || countryCodeOnly=='de'){
                    letterContent.paymentMethod = 'SEPA Lastschrift (einmalig)';
                    letterContent.amount = countryCodeOnly=='at' ? '&euro; 29,95' : '29,95 &euro;';
                }

                let company = {
                    companyName: req.body.companyName,
                };

                if (payment) {
                    // console.log(payment)
                    

                    req.body.paymentVendor = 'stripe';

                    //Letters create part
                    const requestParams = await UnsubbyLetterService.sendLetters(req.body);
                    letterContent.companies = requestParams.companies;
                    if(countryCodeOnly=='fr'){
                        letterContent.paymentMethod = 'Prélèvement SEPA (unique)';
                        letterContent.amount = formateAmountForCountry(countryCodeOnly, amount);
                    }else if(countryCodeOnly=='at' || countryCodeOnly=='de'){
                        letterContent.paymentMethod = 'SEPA Lastschrift (einmalig)';
                        letterContent.amount = formateAmountForCountry(countryCodeOnly, amount);
                    }

                    res.json({
                        status: true,
                        type: "created",
                        message: "Order created successfully",
                        data: payment,
                        order_id: order_id
                    });

                    letterContent.isSepa = true;

                    //Now companyName will be multiple
                    //As per task https://onlinepartnership.monday.com/boards/6428667968/pulses/6496692473         
                    if (req.body.companies && req.body.companies.length > 0) {
                        letterContent.companyName = companyNames;
                    }

                    let {
                        htmlContent,
                        subject
                    } = await EmailTemplate.getPaymentConfirmationEmail(langCodeOnly, letterContent)

                    sendEmailUnsubby({
                        to: req.body.formData ?.Emailadres,
                        subject: subject,
                        body: htmlContent,
                        replyTo: SupportEmail[req.body.countryCode],
                        name : 'paymentConfirmationEmail'
                    });

                    //Add payment into database
                    addPayment(requestParams);

                    //check if user subscribed for my unsubby subscripion
                    /*if (requestParams.doSubscription && requestParams.countryCode=='de') {
                        CustomerService.createCustomerAndSubscription(requestParams);
                    }*/


                    const thirtyMinBefore = moment().subtract(30, 'minute');
                    const countOrder = await getFilteredOrderCount({
                        paymentVendor: 'stripe', //we can de also
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
                    if(req.body.companies){
                        companyIds = req.body.companies.map(item=>{return item.company});
                    }else{
                        companyIds = [req.body.company];
                    }
                    
                    updateOneCompanyDyno({
                        _id: {$in:companyIds}
                    }, {
                        $inc: {
                            orderCount: 1,
                            orderSum: 29.95
                        }
                    });

                    //update statistics 
                    OrderService.updateOrderStatistics({
                        domain: 'unsubby'
                    }, {
                        $inc: {
                            grandTotal: 29.95
                        }
                    })

                }
            }

        } catch (error) {
            console.error("Error "+iban, error);
            if (error.message && error.message.indexOf('The bank account is invalid') > -1) {
                return res.json({
                    status: false,
                    type: "iban",
                    message: CountryData[countryCodeOnly].invalidIBANMessage
                })
            };
            console.log('Bodyyyyyy #######################', JSON.stringify(req.body));
            sendErrorNotification('Unsubby: Error in create order', error);
        }
    }

    static async paymentWebhookMollie(req, res) {
        console.log("UnSubbyPayment webhook called mollie");
        try {


            let payment = await mollieClient.payments.get(req.body.id);

            let updateFields = {
                paymentResponse: payment,
                orderId: payment.metadata.orderId,
            }


            if (payment?.amountChargedBack || payment.status == 'failed') {

                const orderDetail = await getOrder({
                    orderId: updateFields.orderId
                });

                let emailParams = orderDetail.letterContent;
                emailParams.orderId = orderDetail.orderId;
                emailParams.orderDate = `${orderDetail.date.getDate()<10?"0":""}${orderDetail.date.getDate()}-${orderDetail.date.getMonth()<9?"0":""}${orderDetail.date.getMonth() + 1}-${orderDetail.date.getFullYear()}`;
                if (!emailParams.companyName) {
                    emailParams.companyName = orderDetail.company.companyName;
                }
                //Now companyName will be multiple
                //As per task https://onlinepartnership.monday.com/boards/6428667968/pulses/6496692473         
                if (orderDetail.companies && orderDetail.companies.length > 0) {
                    emailParams.companyName = formateCompanyNames(orderDetail.companies, orderDetail.countryCode);
                }
                orderDetail.letterContent.amount = orderDetail.letterContent.amount ? orderDetail.letterContent.amount : 29.95;
                emailParams.countryCode = orderDetail.countryCode;
                let reminderAmount = orderDetail.letterContent.amount.toFixed(2);
                emailParams.reminderAmount = formateAmountForCountry(orderDetail.countryCode, reminderAmount);

                let paymentCheckoutLink = {};

                let paymentParam = {...orderDetail.paymentResponse, redirectUrl : 'https://unsubby.com/'+orderDetail.languageCode+'-'+orderDetail.countryCode};

                if (payment.details && payment.details.bankReasonCode) {
                    //send reminder and increase reminder count
                    if (payment.details.bankReasonCode == BankReasonCodes.MD06) {
                        console.log("MD06 found direct reminder");
                        // Send one email immediatley 
                        paymentCheckoutLink = await createPaymentCheckoutLink(reminderAmount, 'EUR', paymentParam, 14);
                        emailParams.checkout = paymentCheckoutLink._links.paymentLink.href;
                        emailParams.type = 'reminder1';
                        let { htmlContent , subject } = await EmailTemplate.getChargeBackPaymentEmails(orderDetail.languageCode, emailParams);

                        sendEmailUnsubby({
                            to: orderDetail.letterContent.Emailadres,
                            subject: subject,
                            body: htmlContent,
                            replyTo : SupportEmail[orderDetail.countryCode]
                        });
                    
                        console.log("Chargedback payment direct reminder sent", orderDetail.orderId);

                        updateFields.chargedBackUpdatedAt = moment().add(7, 'days').format('L');
                        updateFields.failedUpdatedAt = null;

                    } else if (BankReasonCodes.FaildCodes.indexOf(payment.details.bankReasonCode) > -1) {


                        // Send one email immediatley
                        paymentCheckoutLink = await createPaymentCheckoutLink(reminderAmount, 'EUR', paymentParam, 14);
                        emailParams.checkout = paymentCheckoutLink._links.paymentLink.href;
                        updateFields.failedUpdatedAt = moment().add(7, 'days').format('L');
                        updateFields.chargedBackUpdatedAt = null;
                        emailParams.type = 'paymentReminder1';
                        let { htmlContent , subject } = await EmailTemplate.getFailedPaymentEmails(orderDetail.languageCode, emailParams);
                        sendEmailUnsubby({
                            to: orderDetail.letterContent.Emailadres,
                            subject: subject,
                            body: htmlContent,
                            replyTo : SupportEmail[orderDetail.countryCode]
                        });
                        console.log("Failed payment direct reminder sent", orderDetail.orderId);
                    }

                    if (orderDetail.reminderCount == 0 || !orderDetail.reminderCount) {
                        updateFields.reminderCount = 1;
                    }

                    if (paymentCheckoutLink.id) {
                        updateFields.paymentLink = {
                            id: paymentCheckoutLink.id,
                            url: paymentCheckoutLink._links.paymentLink.href
                        }
                    }
                }


                //cancel mandate and subscription
                const customer = await CustomerService.findOne({email:orderDetail.letterContent.Emailadres}, {subscriptionResponse:1})
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

            } else {
                console.log("payment webhook else ", payment.metadata.orderId);
                updateFields.chargedBackUpdatedAt = null;
                updateFields.failedUpdatedAt = null;

            }

            console.log("payment response paid --------------");
            updateOrder({
                orderId: payment.metadata.orderId
            }, updateFields);
            return res.status(200).send("Webhook received successfully.");
        } catch (error) {
            try{
            if(error.message && error.message.indexOf('but belongs to a different website profile than the API key used')>-1){
                let payment = await mollieClientAbbostop.payments.get(req.body.id);

            let updateFields = {
                paymentResponse: payment,
                orderId: payment.metadata.orderId,
            }


            if (payment?.amountChargedBack || payment.status == 'failed') {

                const orderDetail = await getOrder({
                    orderId: updateFields.orderId
                });

                let emailParams = orderDetail.letterContent;
                emailParams.orderId = orderDetail.orderId;
                emailParams.orderDate = `${orderDetail.date.getDate()<10?"0":""}${orderDetail.date.getDate()}-${orderDetail.date.getMonth()<9?"0":""}${orderDetail.date.getMonth() + 1}-${orderDetail.date.getFullYear()}`;
                if (!emailParams.companyName) {
                    emailParams.companyName = orderDetail.company.companyName;
                }

                //Now companyName will be multiple
                //As per task https://onlinepartnership.monday.com/boards/6428667968/pulses/6496692473         
                if (orderDetail.companies && orderDetail.companies.length > 0) {
                    emailParams.companyName = formateCompanyNames(orderDetail.companies, orderDetail.countryCode);
                }
                
                orderDetail.letterContent.amount = orderDetail.letterContent.amount ? orderDetail.letterContent.amount : 29.95;
                emailParams.countryCode = orderDetail.countryCode;
                let reminderAmount = orderDetail.letterContent.amount.toFixed(2);
                emailParams.reminderAmount = formateAmountForCountry(orderDetail.countryCode, reminderAmount);

                let paymentCheckoutLink = {};

                let paymentParam = {...orderDetail.paymentResponse, redirectUrl : 'https://unsubby.com/de-de'};

                if (payment.details && payment.details.bankReasonCode) {
                    //send reminder and increase reminder count
                    if (payment.details.bankReasonCode == BankReasonCodes.MD06) {
                        console.log("MD06 found direct reminder");
                        // Send one email immediatley 
                        paymentCheckoutLink = await createPaymentCheckoutLink(reminderAmount, 'EUR', paymentParam, 14);
                        emailParams.checkout = paymentCheckoutLink._links.paymentLink.href;
                        emailParams.type = 'reminder1';
                        let { htmlContent , subject } = await EmailTemplate.getChargeBackPaymentEmails(orderDetail.languageCode, emailParams);

                        sendEmailUnsubby({
                            to: orderDetail.letterContent.Emailadres,
                            subject: subject,
                            body: htmlContent,
                            replyTo : SupportEmail[orderDetail.countryCode]
                        });
                    
                        console.log("Chargedback payment direct reminder sent", orderDetail.orderId);

                        updateFields.chargedBackUpdatedAt = moment().add(7, 'days').format('L');
                        updateFields.failedUpdatedAt = null;

                    } else if (BankReasonCodes.FaildCodes.indexOf(payment.details.bankReasonCode) > -1) {


                        // Send one email immediatley
                        paymentCheckoutLink = await createPaymentCheckoutLink(reminderAmount, 'EUR', paymentParam, 14);
                        emailParams.checkout = paymentCheckoutLink._links.paymentLink.href;
                        updateFields.failedUpdatedAt = moment().add(7, 'days').format('L');
                        updateFields.chargedBackUpdatedAt = null;
                        emailParams.type = 'paymentReminder1';
                        let { htmlContent , subject } = await EmailTemplate.getFailedPaymentEmails(orderDetail.languageCode, emailParams);
                        sendEmailUnsubby({
                            to: orderDetail.letterContent.Emailadres,
                            subject: subject,
                            body: htmlContent,
                            replyTo : SupportEmail[orderDetail.countryCode]
                        });
                        console.log("Failed payment direct reminder sent", orderDetail.orderId);
                    }

                    if (orderDetail.reminderCount == 0 || !orderDetail.reminderCount) {
                        updateFields.reminderCount = 1;
                    }

                    if (paymentCheckoutLink.id) {
                        updateFields.paymentLink = {
                            id: paymentCheckoutLink.id,
                            url: paymentCheckoutLink._links.paymentLink.href
                        }
                    }
                }

            } else {
                console.log("payment webhook else ", payment.metadata.orderId);
                updateFields.chargedBackUpdatedAt = null;
                updateFields.failedUpdatedAt = null;

            }

                console.log("payment response paid --------------");
                updateOrder({
                    orderId: payment.metadata.orderId
                }, updateFields);
                return res.status(200).send("Webhook received successfully.");
            }
            }catch(error2){
                //sendErrorNotification('Error in unsubby payment webhook', error2);
                console.error("Error in unsubby payment webhook id", error2);
                return res.status(200).send("Webhook received successfully.");
            }
            
            console.error("Error in unsubby payment webhook", error);
            return res.status(200).send("Webhook received successfully.");
        }
    }

}