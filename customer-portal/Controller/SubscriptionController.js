 import bcrypt from 'bcrypt';
 import JWTMiddleware from '../Middleware/auth.middleware.js';
 import CustomerService from '../Service/customerService.js';
 import SubscriptionMollieService from '../Service/subscriptionMollieService.js';
 import {
     getPaymentDetailUnsubby
 } from '../../Service/mollieService.js';
 import SubscriptionService from '../Service/subscriptionService.js';
 import moment from 'moment';
 import {
     BankReasonCodes
 } from '../../utils/constant.js'
 import {
     createPaymentCheckoutLink
 } from '../../Service/mollieService.js';
 //import crypto from 'crypto';
 import {
     UNSUBBY_WEBSITE,
     ABBOSTOP_WEBSITE
 } from '../../config.js'

 import EmailTemplate from '../../unsubby/EmailTemplates/index.js';
 import {
     sendEmail,
     sendEmailUnsubby
 } from "../../Service/emailService.js";

 import {
     CountryData , SupportEmail
 } from "../../utils/constant.js";
 import {
     sendErrorNotification,
     verifyReCaptchToken,
     formateAmountForCountry,
     getSubscriptiUniqeId
 } from '../../Service/commonService.js';
import StripeService from '../../unsubby/Service/stripeService.js';
import customer from 'mollie-api-node/lib/mollie/api/object/customer.js';


 export default class SubscriptionController {

     //when changing payment method and from inside panel
     static async create(req, res) {
         try {

             if (!req.customer || !req.customer.customerId) {
                 return res.status(401).send({
                     success: false,
                     message: "Failed , invalid user",
                     messageKey : 'invalidToken'

                 })
             }

             let data = req.body;
             data.dbCustomerId = req.customer.customerId;

             //const createSubscription1 = await SubscriptionService.createFirstPaymentSubscription(data);

             let createSubscription = {}
             let updateFields = {};
             if(data.countryCode == "us"){
                createSubscription = await SubscriptionService.createStripeFirstPaymentSubscription(data);
                updateFields.paymentResponse = createSubscription;
                updateFields.mollie = {
                    customerId: createSubscription.customerId,
                    //nextPaymentDate: createSubscription.nextPaymentDate
                }
             }
            else if (data.paymentMethod != 'directdebit' && data.countryCode != "en-us") {
                 createSubscription = await SubscriptionService.createFirstPaymentSubscription(data);
                 updateFields.paymentResponse = createSubscription;
                 updateFields.mollie = {
                     customerId: createSubscription.customerId,
                     //nextPaymentDate: createSubscription.nextPaymentDate
                 }
             } else if (data.paymentMethod == 'directdebit') {
                
                if (!data.startDate) {
                    updateFields.credit = {
                        available: 5,
                        used: 0
                    }
                    data.startDate = moment().utc().format("YYYY-MM-DD");
                }

                 createSubscription = await SubscriptionService.createSubscription(data);
                if (createSubscription.error) {
                    let errorResponse = {
                        success: false,
                        message: "Failed",
                        error: createSubscription.error,
                    }
                    if (createSubscription.message && createSubscription.message.indexOf('The bank account is invalid') > -1) {
                        errorResponse = {
                            status: false,
                            type: "iban",
                            message: CountryData[data.countryCode].invalidIBANMessage
                        }
                    }
                    return res.json(errorResponse);
                };
                
                 updateFields.subscriptionResponse = createSubscription;
                 updateFields.mollie = {
                     customerId: createSubscription.customerId,
                     nextPaymentDate: createSubscription.nextPaymentDate
                 }

                try {
                    //to fast response , pass mongoid here
                    const customer = await CustomerService.findOne({
                        _id: req.customer.customerId
                    });
                    if (customer.subscriptionResponse && customer.subscriptionResponse.status == 'active') {
                        //cancel old subcription if any
                        const cancelledSubscription = await SubscriptionMollieService.cancelSubscription({
                            customerId: customer.mollie.customerId,
                            id: customer.subscriptionResponse.id
                        })
                    }

                } catch(canelerror) {
                    console.error(canelerror);
                }
             }
             //update customerId and payment into db
             const updateCustomer = await CustomerService.updateOne({
                 _id: req.customer.customerId
             }, updateFields);

             return res.json({
                 success: true,
                 message: "success",
                 messageKey: data.messageKey? data.messageKey : 'subscriptionCreated',
                 data: createSubscription,
                 secret:createSubscription.client_secret || createSubscription?.latest_invoice?.payment_intent?.client_secret   

             });

         } catch (error) {
             console.error("Error", error);
             sendErrorNotification('Unsubby : Error in subscription create', error);
             return res.status(500).send({
                 success: false,
                 message: "Failed",
                 error: error,
             })
         }
     }

    static async  createDirect(req, res) {
        try {

            let data = req.body;
            if (data.paymentResponse) {
                /*data.letterContent = data.formData;
                data.languageCode = data.countryCode.split('-')[0];
                data.countryCode = data.countryCode.split('-')[1];*/
                CustomerService.createCustomerAndSubscription(data);
                return res.json({
                    success: true,
                    msg: "success"
                });
            }
        } catch (error) {
            console.error("Error", error);
            sendErrorNotification('Unsubby : Error in subscription createDirect', error);
            return res.status(500).send({
                success: false,
                message: "Failed",
                error: error,
            })
        }
    }

     static async changePaymentMethod(req, res) {
         try {

             if (!req.customer || !req.customer.customerId) {
                 return res.status(401).send({
                     success: false,
                     message: "Failed , invalid user",
                     messageKey : 'invalidToken'

                 })
             }

             const customer = await CustomerService.findOne({
                 _id: req.customer.customerId
             });

             const data = req.body;

             //const websiteUrl = data.countryCode=='nl'?ABBOSTOP_WEBSITE:`${UNSUBBY_WEBSITE}/${data.languageCode}-${data.countryCode}`;
             //req.body.cancelUrl = `${websiteUrl}/${req.body.cancelUrl}`;

             //const nextPaymentDate = customer.subscriptionResponse.startDate;

             const subscriptionMollie = await SubscriptionService.createSubscription({
                 customerId: customer.mollie.customerId,
                 amount: data.amount,
                 cancelUrl: "https://unsubby.com",
                 cardToken: data.cardToken,
                 paymentMethod: data.paymentMethod,
                 firstName: data.firstName,
                 startDate: moment().utc().format("YYYY-MM-DD"), //customer.subscriptionResponse.startDate,
                 redirectUrl: data.successUrl ? `${websiteUrl}${data.successUrl}` : `${websiteUrl}/my-unsubby/subscription-success`,
                 cancelUrlUrl: data.cancelUrlUrl ? `${websiteUrl}${data.cancelUrlUrl}` : `${websiteUrl}/my-unsubby/subscription-success?type=message`,
                 iban: data.iban,
                 metadata: {
                     domain: 'unsubby.com',
                     countryCode: `${data.languageCode}-${data.countryCode}`,
                     firstName: data.firstName,
                     email: data.email,
                     method:data.paymentMethod
                 }
             })

             //update customerId and payment into db
             const updateCustomer = await CustomerService.updateOne({
                 _id: req.customer.customerId
             }, {
                 subscriptionResponse: subscriptionMollie
             });

             return res.json({
                 success: true,
                 msg: "success",
                 data: subscriptionMollie,
             });

         } catch (error) {
             console.error("Error", error);
             sendErrorNotification('Unsubby : Error in changePaymentMethod of subscription', error);
             return res.status(500).send({
                 success: false,
                 message: "Failed",
                 error: error,
             })
         }
     }

     static async stripeCheckoutSession(req,res){
        try{
            const data = req.body;
            const checkoutSession = await StripeService.createCheckoutSession({
                customerId:data.customerId,
                subscriptionId:data.subscriptionId,
                email:data.email,
                redirectUrl:`${UNSUBBY_WEBSITE}/${data.languageCode}-${data.countryCode}/my-unsubby/account?type=subscription`
            })
            return res.json({
                success: true,
                message: "success",
                data: checkoutSession,
            });
        }catch(error){
            console.error("Error in stripeCheckoutSession", error);
            sendErrorNotification('Unsubby : Error in stripeCheckoutSession create', error);
            return res.status(500).send({
                success: false,
                message: "Failed",
                error: error,
            })
        }
     }

     static async reactivateSubscription(req, res) {
         try {

             if (!req.customer || !req.customer.customerId) {
                 return res.status(401).send({
                     success: false,
                     message: "Failed , invalid user",
                     messageKey : 'invalidToken'

                 })
             }

             const customer = await CustomerService.findOne({
                 _id: req.customer.customerId
             });

             const data = req.body;
             delete data.startDate;

             const websiteUrl = data.countryCode=='nl'?ABBOSTOP_WEBSITE:`${UNSUBBY_WEBSITE}/${data.languageCode}-${data.countryCode}`;
             //req.body.cancelUrl = `${websiteUrl}/${req.body.cancelUrl}`;

             //const nextPaymentDate = customer.subscriptionResponse.startDate;

             const subscriptionMollie = await SubscriptionService.createSubscription({
                 customerId: customer.mollie.customerId,
                 amount: data.amount,
                 countryCode : data.countryCode,
                 languageCode : data.languageCode,
                 cancelUrl: "https://unsubby.com",
                 cardToken: data.cardToken,
                 paymentMethod: data.paymentMethod,
                 firstName: data.firstName,
                 startDate: moment().utc().format("YYYY-MM-DD"), //customer.subscriptionResponse.startDate,
                 redirectUrl: data.successUrl ? `${websiteUrl}${data.successUrl}` : `${websiteUrl}/my-unsubby/subscription-success`,
                 cancelUrlUrl: data.cancelUrlUrl ? `${websiteUrl}${data.cancelUrlUrl}` : `${websiteUrl}/my-unsubby/subscription-success?type=message`,
                 iban: data.iban,
                 metadata: {
                     domain: 'unsubby.com',
                     countryCode: `${data.languageCode}-${data.countryCode}`,
                     firstName: data.firstName,
                     email: data.email,
                     method:data.paymentMethod
                 },
                 mandateId : customer.subscriptionResponse.mandateId
             })

            if (subscriptionMollie.error) {
                let errorResponse = {
                    success: false,
                    message: "Failed",
                    error: subscriptionMollie.error,
                }
                if (subscriptionMollie.message && subscriptionMollie.message.indexOf('The bank account is invalid') > -1) {
                    errorResponse = {
                        status: false,
                        type: "iban",
                        message: CountryData[data.countryCode].invalidIBANMessage
                    }
                }
                return res.json(errorResponse);
            };


            //update customerId and payment into db
            const updateCustomer = await CustomerService.updateOne({
                _id: req.customer.customerId
            }, {
                subscriptionResponse: subscriptionMollie,
                'mollie.nextPaymentDate': subscriptionMollie.nextPaymentDate,
                credit: {
                    available: 5,
                    used: 0
                }
            });

             return res.json({
                 success: true,
                 message: "success",
                 messageKey:'subscriptionCreated',
                 data: subscriptionMollie,
             });

         } catch (error) {
             console.error("Error", error);
             sendErrorNotification('Unsubby : Error in subscription reactivateSubscription', error);
             return res.status(500).send({
                 success: false,
                 message: "Failed",
                 error: error,
             })
         }
     }


     static async getOne(req, res) {
         try {

             if (!req.customer || !req.customer.customerId) {
                 return res.status(401).send({
                     success: false,
                     message: "Failed , invalid user",
                     messageKey: 'invalidToken'

                 })
             }

             console.log(req.params.id, "ccccccccccc")

             const customer = await CustomerService.findOne({
                 _id: req.params.id
             });

             const mandateId = customer.subscriptionResponse.mandateId;
             const mandateDetail = await SubscriptionMollieService.getCustomerMandateDetail({
                 mandateId: mandateId,
                 customerId: customer.mollie.customerId
             })


             return res.json({
                 success: true,
                 message: "success",
                 data: {...customer,
                     mandateResponse: mandateDetail
                 },
             });

         } catch (error) {
             return res.status(500).send({
                 success: false,
                 message: "Failed",
                 error: error,
             })

         }
     }

     static async update(req, res) {
         try {
             delete req.body.password;
             const subscription = await CustomerService.updateOne({
                 _id: req.body._id
             }, req.body);
             return res.json({
                 success: true,
                 message: "success",
                 data: subscription,
             });
         } catch (error) {

             return res.status(500).send({
                 success: false,
                 message: "Failed",
                 error: error,
             })
         }

     }

     static async list(req, res) {
         try {

             let condition = {};
             if (req.body.company) {
                 condition.company = req.body.company
             }
             const subscriptions = await CustomerService.find(condition);
             return res.json({
                 success: true,
                 message: "success",
                 data: subscriptions,
             });

         } catch (error) {
             console.error('Error in subscription list', error);
             return res.status(500).send({
                 success: false,
                 message: "Failed",
                 error: error,
             })
         }
     }

     //cancel subscription
     static async deleteOne(req, res) {
         /*if (!req.customer || !req.customer.customerId) {
             return res.status(401).send({
                 success: false,
                 message: "Failed , invalid user",
                 messageKey : 'invalidToken']


             })
         }*/
        const dbCustomerId = req.customer && req.customer.customerId ? req.customer.customerId : req.params.id;

         
        if (!dbCustomerId || dbCustomerId == 'undefined') {
            return res.status(500).send({
                success: false,
                message: "Failed",
                error: 'Server error, please try again later',
            })
        }

         //to fast response , pass mongoid here
         const customer = await CustomerService.findOne({
             _id: dbCustomerId
         });


         try {
             if (!customer.subscriptionResponse || customer.subscriptionResponse.status == 'canceled') {
                 return res.json({
                     success: true,
                     messageKey : 'subscriptionNotFound',
                     message: "Subscription already canceled or not found, you can't cancel again",
                     data: {},
                 });
             }
            
             let cancelledSubscription=null
             if(customer?.subscriptionResponse?.object === "subscription"){
                 cancelledSubscription = await StripeService.cancelSubscription(customer.subscriptionResponse.id)
                }else{
                cancelledSubscription = await SubscriptionMollieService.cancelSubscription({
                    customerId: customer.mollie.customerId,
                    id: customer.subscriptionResponse.id
                })
             }

             customer.subscriptionResponse = cancelledSubscription;
             customer.save();


             return res.json({
                 success: true,
                 message: "success",
                 messageKey : 'subscriptionCanceled',
                 data: cancelledSubscription,
             });

         } catch (error) {
             console.log("Error" + customer.email, error);
             sendErrorNotification('Unsubby : Error in subscription cancel ' + customer.email, error);
             return res.status(500).send({
                 success: false,
                 message: "Failed",
                 error: error,
             })

         }
     }
     static async mollieSubscriptionPaymentWebhook(req, res) {
         try {
             let payment = await getPaymentDetailUnsubby({
                 id: req.body.id
             });
             res.status(200).send("Webhook received successfully.");

             CustomerService.updateOne({
                 'paymentResponse.id': payment.id
             }, {
                 'paymentResponse.status': payment.status
             });

             if (payment && payment.status == 'paid' && payment.method != 'directdebit') {

                let amount = parseFloat(payment.amount.value);
                if (amount == 0) {
                    amount = 4.95
                }

                                
                 // This part we need to do at webhook
                 const subscriptionMollie = await SubscriptionService.createSubscription({
                     customerId: payment.customerId,
                     amount: amount,
                     //paymentMethod: payment.method, mutual exclusion error
                     metadata: payment.metadata,
                     firstName: payment.metadata.firstName,
                     startDate: payment.metadata.startDate ? payment.metadata.startDate : moment().add(1, 'months').utc().format("YYYY-MM-DD"),
                     countryCode: payment.metadata.countryCode.split('-')[1],
                     mandateId : payment.mandateId
                 })


                try {
                    //to fast response , pass mongoid here
                    const customer = await CustomerService.findOne({
                        'mollie.customerId': payment.customerId
                    });

                    if (customer.subscriptionResponse && customer.subscriptionResponse.status == 'active') {
                        //cancel old subcription if any
                        const cancelledSubscription = await SubscriptionMollieService.cancelSubscription({
                            customerId: customer.mollie.customerId,
                            id: customer.subscriptionResponse.id
                        })
                    }
                } catch (canelerror) {
                    console.error(canelerror)
                }

                 let updateFields = {
                     subscriptionResponse: subscriptionMollie,
                     'mollie.nextPaymentDate': subscriptionMollie.nextPaymentDate                     
                 };

                if (parseFloat(payment.amount.value) != 0) {

                     updateFields.credit = {
                         available: 5,
                         used: 0
                     };

                     EmailTemplate.getEmailFromDB(payment.metadata.countryCode.split('-')[0], {
                         type: "Customer",
                         name: "firstSubscriptioSuccessEmail",
                         countryCode: payment.metadata.countryCode.split('-')[1],
                         to: payment.metadata.email
                     }, {
                         firstName: payment.metadata.firstName
                     });
                }
                        

                 const subscription = await CustomerService.updateOne({
                     'mollie.customerId': payment.customerId
                 }, updateFields);

             }

         } catch (error) {
             console.error('Unsubby : Error in mollieSubscriptionPaymentWebhook', error);
             sendErrorNotification('Unsubby : Error in mollieSubscriptionPaymentWebhook', error);
             return res.status(500).send({
                 success: false,
                 message: "Failed",
                 error: error,
             })
         }

     }


     //Subscription payment entry webhook
     static async mollieSubscriptionWebhook(req, res) {
         try {

             console.log("subscription Webhook", req.body);
             res.status(200).send("Webhook received successfully.");
             let payment = await getPaymentDetailUnsubby({
                 id: req.body.id
             });

             //subscriptionId customerId

             let updateFields = {
                paymentResponse: payment
            }


             if (payment.status == 'paid') {

                //Get subscription and update into customer
                let subscription = await SubscriptionMollieService.getSubscriptionDetailUnsubby(payment);

                updateFields.subscriptionResponse = subscription;
                updateFields['mollie.nextPaymentDate'] = subscription.nextPaymentDate;
                updateFields.credit = {
                    available: 5,
                    used: 0
                }

                 if (subscription.startDate == moment().utc().format("YYYY-MM-DD")) {

                    //
                     /*EmailTemplate.getEmailFromDB(subscription.metadata.countryCode.split('-')[0], {
                         type: "Customer",
                         name: "firstSubscriptioSuccessEmail",
                         countryCode: subscription.metadata.countryCode.split('-')[1],
                         to: subscription.metadata.email
                     }, {
                         firstName: subscription.metadata.firstName
                     });*/

                 }

             }

             let emailParams = {};
             if (payment.amountChargedBack || payment.status == 'failed') {

                 emailParams = await CustomerService.findOne({
                      $or: [{
                         'paymentResponse.id': payment.id
                     }, {
                         'subscriptionResponse.id':payment.subscriptionId
                     }],
                     
                 });

                 if(!emailParams){
                    return;
                 }

                 console.log('Item foundddddddddddddd', emailParams);

                 /*//emailParams.orderId = orderDetail.orderId;
                 let subscriptionDate = new Date(emailParams.subscriptionResponse.createdAt);
                 emailParams.orderDate = `${subscriptionDate.getDate()<10?"0":""}${subscriptionDate.getDate()}-${subscriptionDate.getMonth()<9?"0":""}${subscriptionDate.getMonth() + 1}-${subscriptionDate.getFullYear()}`;

                 emailParams.amount = emailParams.subscriptionResponse.amount.value ? parseFloat(emailParams.subscriptionResponse.amount.value) : 4.95;
                 let reminderAmount = emailParams.amount.toFixed(2);
                 emailParams.reminderAmount = formateAmountForCountry(emailParams.countryCode, reminderAmount);

                 let paymentCheckoutLink = {};
                 const websiteUrl = emailParams.countryCode=='nl'?ABBOSTOP_WEBSITE:`${UNSUBBY_WEBSITE}/${emailParams.languageCode}-${emailParams.countryCode}`

                 let paymentParam = {...payment,
                     redirectUrl: websiteUrl//`${websiteUrl}/${emailParams.languageCode}-${emailParams.countryCode}`
                 };*/

                 if (payment.details && payment.details.bankReasonCode) {
                     /*emailParams.uniqueId = await getSubscriptiUniqeId(payment);*/
                     //send reminder and increase reminder count
                     if (payment.details.bankReasonCode == BankReasonCodes.MD06) {
                         /*console.log("MD06 found direct reminder");
                         // Send one email immediatley 
                         paymentCheckoutLink = await createPaymentCheckoutLink(reminderAmount, 'EUR', paymentParam, 14);
                         emailParams.checkout = paymentCheckoutLink._links.paymentLink.href;
                         emailParams.type = 'reminder1';
                         EmailTemplate.getEmailFromDB(emailParams.languageCode, {
                            type: "SubscriptionChargeback",
                            name: "reminder1",
                            countryCode: emailParams.countryCode,
                            to : emailParams.email
                        }, {
                            firstName: emailParams.firstName,
                            amount : emailParams.reminderAmount, 
                            paymentLink : emailParams.checkout,
                            supportEmail : SupportEmail[emailParams.countryCode],
                            subscriptionId : emailParams.uniqueId
                        });*/

                         console.log("Chargedback payment direct reminder sent", emailParams.email);

                         updateFields.chargedBackUpdatedAt = moment().add(7, 'days').format('L');
                         updateFields.failedUpdatedAt = null;

                     } else if (BankReasonCodes.FaildCodes.indexOf(payment.details.bankReasonCode) > -1) {


                         /*// Send one email immediatley
                         paymentCheckoutLink = await createPaymentCheckoutLink(reminderAmount, 'EUR', paymentParam, 14);
                         emailParams.checkout = paymentCheckoutLink._links.paymentLink.href;
                         updateFields.failedUpdatedAt = moment().add(7, 'days').format('L');
                         updateFields.chargedBackUpdatedAt = null;
                         emailParams.type = 'paymentReminder1';
                         EmailTemplate.getEmailFromDB(emailParams.languageCode, {
                            type: "SubscriptionFailed",
                            name: "paymentReminder1",
                            countryCode: emailParams.countryCode,
                            to : emailParams.email
                        }, {
                            firstName: emailParams.firstName,
                            amount : emailParams.reminderAmount,
                            paymentLink : emailParams.checkout,
                            supportEmail : SupportEmail[emailParams.countryCode],
                            subscriptionId : emailParams.uniqueId
                        });*/

                         console.log("Failed payment direct reminder sent", emailParams.email);
                         updateFields.failedUpdatedAt = moment().add(7, 'days').format('L');
                         updateFields.chargedBackUpdatedAt = null;
                     }

                     if (emailParams.reminderCount == 0 || !emailParams.reminderCount) {
                         updateFields.reminderCount = 1;
                         updateFields.credit = {
                            available: 0,
                            used: 0
                        }
                     }

                     /*if (paymentCheckoutLink.id) {
                         updateFields.paymentLink = {
                             id: paymentCheckoutLink.id,
                             url: paymentCheckoutLink._links.paymentLink.href
                         }*/

                        //cancel existing subscription
                        try {
                            if (emailParams.subscriptionResponse && emailParams.subscriptionResponse.status == 'active') {
                                //cancel old subcription if any
                                const cancelledSubscription = await SubscriptionMollieService.cancelSubscription({
                                    customerId: emailParams.mollie.customerId,
                                    id: emailParams.subscriptionResponse.id
                                })
                                updateFields.subscriptionResponse = cancelledSubscription;
                            }

                        } catch (canelerror) {
                            console.error(canelerror);
                        }
                     /*}*/
                 }



             } else {
                 console.log("payment webhook else ", payment.id);
                 updateFields.chargedBackUpdatedAt = null;
                 updateFields.failedUpdatedAt = null;

             }

             CustomerService.updateOne({
                 _id: emailParams._id
             }, updateFields);

         } catch (error) {
             console.error('Unsubby : Error in mollieSubscriptionWebhook', error);
             sendErrorNotification('Unsubby : Error in mollieSubscriptionWebhook', error);
         }

     }


    static async mollieSubscriptionPaymentLinkWebhook(req, res) {
        try {

            let paymentLink = await SubscriptionMollieService.getPaymentLinkDetail(req.body);
            if (paymentLink.paidAt) {
                console.log("Payment link paid #########", paymentLink)
                let updateFields = {
                    chargedBackUpdatedAt: null,
                    failedUpdatedAt: null
                }
                let updateCondition = {
                    'paymentLink.id': paymentLink.id
                }                
                CustomerService.updateOne(updateCondition, updateFields);
            }

            return res.status(200).send("Webhook pay link received successfully.");
        } catch (error) {
            console.error("Error in subscription payment link webhook id " + req.body.id, error);
            sendErrorNotification('Error in subscription payment link webhook id ' + req.body.id, error);
        }
    }


 }