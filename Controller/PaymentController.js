import { createMollieClient } from "@mollie/api-client";
import nodemailer from 'nodemailer';
import ibantools from "ibantools"
import {uploadinS3} from "../Service/s3FileUploadService.js"
import {logo} from "../utils/logo.js"
import {addressValidator , formateCompanyNames, formateAmountForCountry} from "../Service/commonService.js"
import {
  addPayment,
  getPaymentByOrderId,
  updateOrder,
  getAllOrderList,
  getAllOrder, 
  getOrder,
  getFilteredOrderCount
} from "../Service/paymentService.js";
import {checkCompanySubmit} from "../middleware/checkCompanySubmit.js"
import { createLetter } from "./LetterController.js";
import { ses, AWS } from "../middleware/MailConnection.js";
import moment from 'moment';

import {
     sendEmail
 } from "../Service/emailService.js";
 import {
     BankReasonCodes , CountryData
 } from '../utils/constant.js'

 import {
     createPaymentCheckoutLink
 } from '../Service/mollieService.js';

 import {
     reminder1
 } from '../EmailTemplates/chargebackEmail.js';

 import {
     paymentReminder1
 } from '../EmailTemplates/paymentFailEmail.js';
 import {
     paymentConfirmationEmail
 } from '../EmailTemplates/paymentEmails.js';


 import { updateOneCompanyDyno } from '../Service/companyService.js';

import { MOLLIE_API_KEY,LETTER_DOWNLOAD_URL, MOLLIE_WEBHOOK_URL, TO_EMAILS } from '../config.js';

const mollieClient = createMollieClient({
  apiKey: MOLLIE_API_KEY,
});

import orderid from "order-id";

import { sendErrorNotification , verifyReCaptchToken } from '../Service/commonService.js';
let userAPICount = {};
let lowBalanceAlertCount = 0;
import OrderService from '../Service/orderService.js';
import useragent from 'express-useragent';
import CountryService from '../Service/countyService.js';

import UnsubbyLetterService from '../unsubby/Service/letterService.js';
import CustomerService from '../customer-portal/Service/customerService.js';


const validateIban = async(iban) => {
    try {
        let validBankIban = ["INGB", "RABO", "KNAB", "ABNA", "BUNQ", "SNSB", "TRIO", "ASNB", "RBRB", "FVLB", "ABNC", "AEGO", "BICK", "BINK", "DLBK", "FLOR"]
        let bic = iban.slice(4, 8)
        if (!validBankIban.includes(bic)) {
            return false
        }
        return true
    } catch (error) {
      console.error('Error in validateIban',error);
      sendErrorNotification('Error in validateIban',error);
      return false
    }
}

export const createPayment = async (req, res) => {  
  try {

    let langCodeOnly = req.body.countryCode.split('-')[0];
    let countryCodeOnly = req.body.countryCode.split('-')[1];

    //store API count
     const storeKey = req.body.company+req.body.formData.Emailadres;
     userAPICount[storeKey]=userAPICount[storeKey]?userAPICount[storeKey]+1:1;

     console.log('User try countttttttt', userAPICount[storeKey])
    /*let userAddress = `${req.body?.formData.Adres || req.body?.formData.address || req.body?.formData.adres},${req.body?.formData.postcode},${req.body?.formData?.woonplaats}` 
     let isValidAddress= await addressValidator("NL",userAddress);     
     if(isValidAddress?.verdict?.hasUnconfirmedComponents){
       //console.log(isValidAddress?.verdict)
      console.log("Bodyyyyyyy Address failed", req.body?.formData)

      return res.json({
        status:false,
        type:"address",
        message:"Uw adres is niet correct ingevuld. Controleer a.u.b. het ingevoerde adres.",
        result:isValidAddress
      })
     }*/

     
      const isGTokenVerified = await verifyReCaptchToken(req, 'v3', req.body.code, userAPICount[storeKey]);
      if(!isGTokenVerified){
        console.log("Bodyyyyyyy", req.body?.formData)
         return res.json({
          status:false,
          type:"test",
          message:"Invalid data."
        })
      }


     //return res.status(400).send({status:false, message:'Server Error'});

      let iban = req.body?.formData?.iban.toUpperCase();
      let countryIban=iban.slice(0, 2)
      let isValidIban=ibantools.isValidIBAN(iban)
      let checkCountryIban=await validateIban(iban)
      console.log(iban)
      console.log(isValidIban)
      console.log(checkCountryIban)
     if((!checkCountryIban && countryIban == "NL") || !isValidIban){
        return res.json({
          status:false,
          type:"iban",
          message:"Het IBAN-nummer is ongeldig. Vul een geldig IBAN-nummer in."
        })
      }
      delete req.body?.formData?.iban

      var order_id = orderid().generate();
      let amount = req.body.formData.amount;
      const customer = await mollieClient.customers.create({
        name: req.body?.formData?.voornaam + " " + req.body?.formData?.achternaam,
        email: req.body?.formData?.Emailadres,
      });
      const mandate = await mollieClient.customerMandates.create({
        customerId: customer.id,
        method: "directdebit",
        consumerName:
          req.body?.formData?.voornaam + " " + req.body?.formData?.achternaam,
        consumerAccount: iban,
        mandateReference: req.body.companyName + "-MD" + order_id,
      });
      if (mandate.status == "valid") {
        let data = req.body.formData;
        req.body.letterContent = data;
        order_id = "ORD-" + order_id;

        let companyNames = req.body.companies ? formateCompanyNames(req.body.companies, countryCodeOnly) : req.body.companyName;               

        let metadata = {
            countryCode: `${langCodeOnly}-${countryCodeOnly}`,
            orderId: order_id,
            formData: req.body ?.formData,
            companyName: companyNames
        }

        if (req.body.companies && req.body.companies.length > 1) {
            metadata.multicancellation = 'Yes';
        }
        
        const payment = await mollieClient.payments.create({
          amount: {
            currency: "EUR",
            value: amount.toFixed(2),
          },
          description: "Opzegging " + companyNames + " via eenmalige SEPA-betaling [NL] "+order_id,
          sequenceType: "recurring",
          customerId: customer?.id,
          consumerName:
          req.body?.formData?.voornaam + " " + req.body?.formData?.achternaam,
          consumerAccount: iban,
          webhookUrl: MOLLIE_WEBHOOK_URL,
          metadata: metadata,
        });
        req.body.orderId = order_id;
        req.body.customerId = customer?.id;
        req.body.paymentResponse = payment;
        req.body.ipAddress = req.header('x-forwarded-for') || req.header('X-Real-IP') || req.body.ipAddress;
        const isMobile = useragent.parse(req.headers['user-agent']).isMobile;
        if(!isMobile){
            req.body.deviceType = 'desktop';
        }
        req.body.countryCode = countryCodeOnly;
        req.body.languageCode = langCodeOnly;     
        var letterContent = {
          voornaam: req.body?.formData?.voornaam,
          achternaam: req.body?.formData?.achternaam,
          Adres: req.body?.formData.Adres || req.body?.formData.address || req.body?.formData.adres,
          Emailadres: req.body?.formData?.Emailadres,
          datumdate: req.body?.formData?.datumdate,
          klantnummer: req.body?.formData?.klantnummer,
          reason: req.body?.formData?.reason,
          companyName :companyNames
        };

        if(payment){
          // console.log(payment)         
          
          letterContent.paymentMethod = 'SEPA Automatische incasso (eenmalig)';
          letterContent.paymentStatement = 'Abbo Stop via Mollie';
          letterContent.amount = req.body.letterContent.amount ? req.body.letterContent.amount.toLocaleString(CountryData['nl'].locale.replace('_', '-')) : '29,95';
          letterContent.isSepa = true;
          letterContent.orderId = order_id;

          try {
              let requestParams = await UnsubbyLetterService.sendLetters(req.body);
              letterContent.companies = requestParams.companies;

              let {
                  htmlContent,
                  subject
              } = await paymentConfirmationEmail(letterContent);

              sendEmail({
                  to: letterContent.Emailadres,
                  subject: subject,
                  body: htmlContent,
                  name : 'paymentConfirmationEmail'
                  //replyTo: SupportEmail[order.countryCode]
              });

              addPayment(requestParams);
              res.json({
                  status: true,
                  type: "created",
                  message: "Order created successfully",
                  data: payment,
              });

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
                      orderCount: 1,
                      orderSum: 29.95
                  }
              })

              //update statistics 
              OrderService.updateOrderStatistics({domain:'abbostop'},{
                  $inc: {
                      grandTotal: 29.95
                  }
              })

            //sendEmail({to : 'lavkesh1608@gmail.com', subject : 'Abbostop Order created ', body:`<h1>order created <h1>` });

            const thirtyMinBefore = moment().subtract(30, 'minute');
            const countOrder = await getFilteredOrderCount({
                paymentVendor : 'mollie',
                deviceType : 'desktop',
                countryId : '653645399d3c03cfc9a160bb',
                momentDate : {$gte : thirtyMinBefore, $lte : moment()}
            });
            console.log('Order count on 30 minnnnnnnn=>', countOrder);
            if(countOrder>=15){
              sendEmail({to : TO_EMAILS, subject : 'Abbostop Alert ! 15 order created within a 30 mins for Desktop only ', body:`<h1>Abbostop Alert ! 15 order created within a 30 mins for Desktop only <h1>` });
              //disable desktop orders
              await CountryService.upateOne({
                  id: '653645399d3c03cfc9a160bb'
              }, {
                  setting: { desktopOrderStatus : false }
              });
            }

          } catch (error) {

              addPayment(req.body);
              res.json({
                  status: true,
                  type: "created",
                  message: "Order created successfully",
                  data: payment,
              });
              updateOneCompanyDyno({
                  _id: req.body.company
              }, {
                  $inc: {
                      orderCount: 1, 
                      orderSum:29.95
                  }

              })
              //update statistics 
              OrderService.updateOrderStatistics({domain:'abbostop'},{
                  $inc: {
                      grandTotal: 29.95
                  }
              })
              console.error('Abbostop Error in letter create', error);
              sendErrorNotification('Abbostop Error in letter create', error);
          }
          

        }else{
          res.json({
            status: false,
            type:'failed',
            message: "Failed to create order"
          });
        }
      }
  }catch(error){
      console.error('Abbostop Error in order create',error);
      sendErrorNotification('Abbostop Error in order create',error);
        res.json({
            status: false,
            type: 'failed',
            message: "Failed to create order, please try again"
        });
  }
};

//for fetch payment from webhooks

export const getDatafromWebHooks = async(req, res) => {

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
             emailParams.reminderAmount = formateAmountForCountry(orderDetail.countryCode, orderDetail.letterContent.amount.toFixed(2));


            let paymentCheckoutLink = {};


            if (payment.details && payment.details.bankReasonCode) {
                //send reminder and increase reminder count
                if (payment.details.bankReasonCode == BankReasonCodes.MD06) {
                    console.log("MD06 found direct reminder");
                    // Send one email immediatley 

                    paymentCheckoutLink = await createPaymentCheckoutLink(orderDetail.letterContent.amount.toFixed(2), 'EUR', orderDetail.paymentResponse,14);
                    emailParams.checkout = paymentCheckoutLink._links.paymentLink.href;
                    const htmlContent = reminder1(emailParams);
                    sendEmail({
                        to: orderDetail.letterContent.Emailadres,
                        subject: 'BETAALHERINNERING: Weigering Betaalverplichting. Automatische incasso gestorneerd.',
                        body: htmlContent
                    });
                    console.log("Chargedback payment direct reminder sent", orderDetail.orderId);

                    updateFields.chargedBackUpdatedAt = moment().add(7, 'days').format('L');
                    updateFields.failedUpdatedAt = null;

                } else if (BankReasonCodes.FaildCodes.indexOf(payment.details.bankReasonCode) > -1) {


                    // Send one email immediatley
                    paymentCheckoutLink = await createPaymentCheckoutLink(orderDetail.letterContent.amount.toFixed(2), 'EUR', orderDetail.paymentResponse, 14);
                    emailParams.checkout = paymentCheckoutLink._links.paymentLink.href;
                    updateFields.failedUpdatedAt = moment().add(7, 'days').format('L');
                    updateFields.chargedBackUpdatedAt = null;
                    const htmlContent = paymentReminder1(emailParams);
                    sendEmail({
                        to: orderDetail.letterContent.Emailadres,
                        subject: 'BETALING MISLUKT: Betaal het openstaande bedrag zo spoedig mogelijk.',
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
    } catch (error) {
        console.error("Error in payment webhook", error);
        sendErrorNotification('Error in payment webhook',error);
        return res.status(200).send("Webhook received successfully.");
    }

};



export const getDatafromLinkWebHooks = async(req, res) => {

    try {

        let paymentLink = await mollieClient.paymentLinks.get(req.body.id);
        if (paymentLink.paidAt) {
            console.log("Payment link paid #########", paymentLink)
            let updateFields = {
                chargedBackUpdatedAt: null,
                failedUpdatedAt: null
            }
            
            let orderIds = paymentLink.description.split('ORD-');
            let updateCondition = {
                'paymentLink.id': paymentLink.id                
            }
            if(orderIds.length>1){
              const orderId = 'ORD-'+orderIds[orderIds.length-1];  
              updateCondition.orderId = orderId;
            }
            
            updateOrder(updateCondition, updateFields);

            /* updated after manually found issue
             updateOrder({
                'paymentLink.id': paymentLink.id,
                'paymentLink.url': paymentLink._links.paymentLink.href
            }, updateFields);*/

        }

        return res.status(200).send("Webhook pay link received successfully.");
    } catch (error) {
        console.error("Error in payment link webhook id "+req.body.id, error);
        sendErrorNotification('Error in payment link webhook id '+req.body.id, error);
    }
}


export const getPayment = async (req, res) => {
 
};

const PaymentconfirmationEmail = async(req) => {
  const { letterContent, company, iban,downloadUrl,order_id } = req;
  console.log("mail api ------------");
 
  const transporter = nodemailer.createTransport({
    SES: ses
  });

  const htmlContent=`<!DOCTYPE html>
          <html lang="en">
            <head>
              <meta charset="UTF-8" />
              <meta name="viewport" content="width=device-width, initial-scale=1.0" />
              <title>Confirmation Email</title>
              <style>
                body {
                  margin: 0;
                  padding: 0;
                }
                p {
                  color: #0d1c47;
                  text-align: justify;
                  font-family: Verdana;
                  font-size: 18px;
                  font-style: normal;
                  font-weight: 400;
                  line-height: 24px;
                }
                a {
                  color: #0090e3;
                }
                span {
                  color: #0090e3;
                  font-family: Verdana;
                  font-size: 18px;
                  font-style: normal;
                  font-weight: 400;
                  line-height: 24px;
                }
                .main-box{
                  width: 900px;
                  box-sizing: border-box;
                  max-width: 100%;
                  margin:0px auto;
                }
                .main {
                  width: 800px;
                  box-sizing: border-box;
                  padding: 0 25px;
                  margin: 0px auto;
                  background: #ffffff;
                  max-width: 100%;
                }
                .header-section {
                  width: 750px;
                  margin: 46px auto;
                  padding-top:10px;
                  max-width: 100%;
                }
                .body-section {
                  width: 750px;
                  margin: 46px auto;
                  background: #f3f3f9;
                  max-width: 100%;
                }
                .inner {
                  padding: 28px 17px;
                }
                .second-inner {
                  width: 750px;
                  margin: -8px auto;
                  max-width: 100%;
                }
                h1 {
                  color: #0090e3;
                  text-align: justify;
                  font-family: Verdana;
                  font-size: 20px;
                  font-style: normal;
                  font-weight: 700;
                  line-height: 24px;
                  padding: 0;
                  margin: 0;
                }
                
                h3 {
                  color: #0d1c47;
                  text-align: justify;
                  font-family: Verdana;
                  font-size: 16px;
                  font-style: normal;
                  font-weight: 700;
                  line-height: 28px;
                  padding: 0;
                  margin: 0;
                }
                .margintop {
                  padding-top: 24px;
                }
                #body-info {
                  width: 100%;
                  padding-top: 20px;
                }
                #body-info tr td {
                  width: 50%;
                }
                #body-info tr td:first-child {
                  color: #0d1c47;
                  /*text-align: justify;*/
                  font-family: Verdana;
                  font-size: 18px;
                  font-style: normal;
                  font-weight: 700;
                  line-height: 24px;
                  padding: 7px 0px;
                }
                #body-info tr td:last-child {
                  color: #0d1c47;
                  /*text-align: justify;*/
                  font-family: Verdana;
                  font-size: 18px;
                  font-style: normal;
                  font-weight: 400;
                  line-height: 24px;
                  padding: 7px 0px;
                  word-break: break-all;
                }
                .footer {
                  height: 93px;
                  background: #182c55;
                  align-items: center;
                  padding: 0px 25px;
                  max-width: 100%;
                  margin:0px auto;
                }
                .email{
                  margin-top:35px;
                }
                .email a {
                  color: #fff;
                  text-align: justify;
                  font-family: Verdana;
                  font-size: 16px;
                  font-style: normal;
                  font-weight: 400;
                  line-height: 24px;
                  text-decoration: none;
                }
                .rating-star{
                  border:1px solid black;
                  width:70%;
                  margin: 10px auto;
                  padding: 10px;
                  cursor: pointer;
                }
                .rating-a{
                  text-decoration: none;
                }
                .mt{
                  margin-top: 30px;
                }
  
                .truspilot-logo{
                  margin: 10px auto;
                  text-align: center;
                }
  
                .rating-box{
                  margin: 50px auto;
                
                }
                .rating-text {
                  text-align: center;
                  font-size: 14px;
                  color: black;
                }
                .rating-star-1{
                  text-align: center;
                  color: #ff0000	;
                  font-size: 30px;
                }
                .rating-star-2{
                  text-align: center;
                  color: #d78111	;
                  font-size: 30px;
                }
                .rating-star-3{
                  text-align: center;
                  color: #fff531	;
                  font-size: 30px;
                }
                .rating-star-4{
                  text-align: center;
                  color: #36e14f	;
                  font-size: 30px;
                }
                .rating-star-5{
                  text-align: center;
                  font-size: 30px;
                  color: #06850c	;
                }
                @media (min-width: 350px) and (max-width: 768px) {
                  .header-section p {
                    text-align: justify;
                    font-family: Verdana;
                    font-size: 16px;
                    font-style: normal;
                    font-weight: 400;
                    line-height: 22px;
                  }
                  img{
                    width:90px;
                  }
                  h1 {
                    font-family: Verdana;
                    font-size: 18px;
                  }
                  h3 {
                    font-size: 14px;
                  }
                  #body-info tr td:first-child {
                    font-size: 14px;
                    font-weight: 700;
                  }
                  #body-info tr td:last-child {
                    font-size: 14px;
                  }
                  .email{
                    margin-top:30px !important;
                  }
                  .email a{
                    font-size :10px;
                  }
                  p {
                    font-size: 14px;
                  }
                }
              </style>
              </head>
            <body>
            <div class="main-box">
              <div class="main" style="">
                <div class="header-section">
                  
                  <p>Beste ${letterContent?.voornaam},</p>
                  <p>
                  Bedankt voor het gebruikmaken van onze online opzegservice.
                  </p>
                  <p><strong>Uw ${company?.companyName}-opzegbrief is verwerkt!</strong></p>
                  <p>U heeft uw opzegging betaald via een <strong>eenmalige</strong> automatische incasso. Wij schrijven binnen 2 werkdagen eenmalig het bedrag van €29,95 van uw rekening af. U ziet dan op uw afschrift 'Abbo Stop via Mollie’ staan.</p>
                  <p>
                  Uw opzegbrief wordt zo snel mogelijk verstuurd. Het kan enkele dagen duren voordat uw opzegging verwerkt is.
                  </p>
                  <p>Hierbij een overzicht van uw ingevulde gegevens.</p>
                </div>
                <div class="body-section">
                  <div class="inner">
                    <h1>Overzicht van je opzegging</h1>
                    <h3 class="margintop">Opzegbrief ${company?.companyName}</h3>
                    <table border="0" id="body-info">
                      <tbody>
                        <tr>
                          <td class="boldset"><strong>Naam:</strong></td>
                          <td>${letterContent?.voornaam} ${
                              letterContent?.achternaam
                            }</td>
                        </tr>
                        <tr>
                          <td class="boldset"><strong>Adres:</strong></td>
                          <td>${letterContent?.Adres}</td>
                        </tr>
                        <tr>
                          <td class="boldset"><strong>E-mailadres:</strong></td>
                          <td>${letterContent?.Emailadres}</td>
                        </tr>
                        ${letterContent?.klantnummer?`<tr>
                          <td class="boldset"><strong>Klantnummer:</strong></td>
                          <td>${letterContent?.klantnummer}</td>
                        </tr>`:""}
                        ${letterContent?.reason?`<tr>
                        <td class="boldset"><strong>Reden van opzeggen:</strong></td>
                        <td>${letterContent.reason}</td>
                      </tr>`:""}
                      </tbody>
                    </table>

                    <h3 class="margintop">Uw Betaling</h3>
                    <table border="0" id="body-info">
                      <tbody>
                       <tr>
                          <td class="boldset"><strong>Factuur bedrag:</strong></td>
                          <td>€29,95</td>
                       </tr>

                      <tr>
                          <td class="boldset"><strong>Betaalmethode:</strong></td>
                          <td>SEPA Automatische incasso (eenmalig)</td>
                      </tr>

                    </tbody>
                   </table>
                    
                  </div>
                </div>
                <p>U heeft bij uw opzegging ervoor gekozen om de brief zo snel mogelijk te verzenden en heeft daarom vrijwillig afstand gedaan van uw wettelijk recht op herroeping. Voor meer informatie over de uitsluiting van het herroepingsrecht kunt u de algemene voorwaarden doornemen.  </p>
                <div class="second-inner">
                  <p>
                    Onze <a href="https://abbostop.nl/algemene-voorwaarden/">algemene voorwaarden</a> kunt u op elk gewenst moment
                    op de website bekijken. Klik <a href="${downloadUrl}">hier</a> om je opzegbrief te
                    downloaden.
                  </p>
                  <p>
                    Dit is een automatisch gegenereerde e-mail, een reply op dit bericht
                    kunnen we helaas niet beantwoorden.
                  </p>
                  <p>Heeft u vragen, opmerkingen of suggesties?</p>
                  <p>
                    Raadpleeg onze helpdesk pagina of contacteer onze klantenservice via
                    <a style="color:#0090e3;"
                    href="mailto:support@abbostop.nl">support@abbostop.nl</a>. Indien u vragen heeft over de status van uw
                    opzegging, raden wij u aan rechtstreeks contact op te nemen met het
                    bedrijf dat u via ons heeft opgezegd.
                  </p>
                  <div class="rating-box">
                <div class="truspilot-logo"> <img width="150px" src="cid:uniqueu@kreata2.ee"/></div>
                <hr/>
                &nbsp;
                <h3>Hoe heeft u het opzegproces ervaren?<h3>
                  <p>We streven er voortdurend naar onze dienstverlening te verbeteren, en uw feedback is daarbij essentieel. Bedankt dat u de tijd heeft genomen om uw ervaring met ons te delen.</p>
                  <a href="https://trustpilot.com/evaluate/abbostop.nl" class="rating-a">
                  <div class="rating-star mt">
                    <div class="rating-text">Tot nu toe niets te klagen</div>
                    <div class="rating-star-5">★★★★★</div>
                  </div>
                  <a href="https://trustpilot.com/evaluate/abbostop.nl" class="rating-a">
                  <div class="rating-star">
                    <div class="rating-text">Zeer goed</div>
                    <div class="rating-star-5">★★★★</div>
                  </div>
                </a>
                  <a href="mailto:support@abbostop.nl" class="rating-a">
                  <div class="rating-star">
                    <div class="rating-text" >Gemiddeld</div>
                    <div class="rating-star-5">★★★</div>
                  </div>
                </a>
                  <a href="mailto:support@abbostop.nl" class="rating-a">
                  <div class="rating-star">
                    <div class="rating-text">Beneden gemiddeld</div>
                    <div class="rating-star-5">★★</div>
                  </div>
                </a>
                  <a href="mailto:support@abbostop.nl" class="rating-a">
                  <div class="rating-star">
                    <div class="rating-text">Slecht</div>
                    <div class="rating-star-5">★</div>
                  </div>
                  </a>
              </div>
                  <p>
                  <small style="color:grey" ;>Dit is een geautomatiseerd noreply-bericht. Wij verzoeken u vriendelijk geen berichten te verzenden naar dit noreply-adres, aangezien er geen opvolging op reacties plaatsvindt. U kunt ons per e-mail bereiken op <a style="color:#0090e3;" href="mailto:support@abbostop.nl">support@abbostop.nl</a>.
                  </small>
                  </p>
                </div>

                </div>
                <div class="footer" >
                  <div class="logo" style="float:left; margin-top: 35px;">
                  <a  href="https://abbostop.nl/" rel="noreferrer noopener" target="_blank"> <img src="cid:unique@kreata.ee" /></a>
                  </div>
                  <div class="email" style="float:right;">
                    <a href="mailto:support@abbostop.nl">support@abbostop.nl</a>
                  </div>
                </div>
                </div>
            </body>
          </html>
`
  const mailOptions = {
    from: 'Abbo Stop <noreply@abbostop.nl>',
    replyTo:"support@abbostop.nl",
    to:letterContent?.Emailadres,
    // subject:`Uw ${company?.companyName}-opzegbrief wordt verwerkt!`,
    subject:`Uw bestelling bij Abbo Stop is verwerkt! – Ordernummer: ${order_id}`,
    html: htmlContent,
    attachments:[{
      filename: 'AbboStop_Logo_or.png',
      path: 'https://abbostop.s3.eu-north-1.amazonaws.com/AbboStop_Logo_or.png',
      cid: 'unique@kreata.ee' //same cid value as in the html img src
    },
    ,
    {
        filename: 'Trustpilot_Logo_2022.png',
        path:'https://abbostop.s3.eu-north-1.amazonaws.com/Trustpilot_Logo_2022.png',
        cid: 'uniqueu@kreata2.ee'
    }], 
    ses : {
        ConfigurationSetName: 'Notify_bounce',
    }, 
    headers: {
        'x-ses-configuration-set': 'Notify_bounce',
        'bounce_watch': 'abbostop'
    }
  };

// Becomes:
//   X-My-Key: header value
//   X-Another-Key: another value

  transporter.sendMail(mailOptions, (err, data) => {
    if (err) {
      console.log("Error sending email:", err);
    
      return false
    } else {
      console.log("Email sent:", mailOptions.to);
      return true
    }
  });
  return
};


export const getAllOrders=async(req,res)=>{
  try{
  let orderList =await getAllOrderList()
    res.json({
      status:true,
      data:orderList
    })
  }
  catch(err){
    res.json({
      status:true,
      data:orderList
    })
    console.log(err)
  }
}


export const bounceEmailWebhook = async(req, res) => {
    try {

         let bodyData = JSON.parse(req.body.toString());
         const data = JSON.parse(bodyData.Message);
        if (data.eventType == 'Bounce' && data.bounce.bouncedRecipients.length) {
            updateOrder({
                'letterContent.Emailadres': data.bounce.bouncedRecipients[0].emailAddress
            }, {
                emailBounced: true
            });

            CustomerService.updateOne({email:data.bounce.bouncedRecipients[0].emailAddress},{
                emailBounced: true
            })
            console.log('Aws bounce email webhook received', data.bounce.bouncedRecipients[0].emailAddress);
        }

    } catch (err) {
        console.error('Error in bounceEmailWebhook', err);
    }
    
    res.send('Aws bounce email webhook received');
}


