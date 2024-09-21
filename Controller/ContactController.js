import {ses} from "../middleware/MailConnection.js"
import EmailTemplate from "../unsubby/EmailTemplates/index.js"
import {
    sendEmail,
    sendEmailUnsubby
} from "../Service/emailService.js";
import { verifyReCaptchToken } from "../Service/commonService.js";

import {
    SupportEmail 
} from '../utils/constant.js'

import { ENV, TO_EMAILS } from '../config.js';


export const sendContactFrom=(req,res)=>{
  if(!req.body.name || !req.body.email || !req.body.body){
    return res.json({
      message:'Please fill all fields.',
      status:false
    })
  }

  let enquirySubject = 'Contactformulier Abbostop.nl';
  if (req.body.type == 'reviewForm') {
      enquirySubject = 'Review:' + enquirySubject;
      if (req.body.orderId) {
          enquirySubject = req.body.orderId + ' ' + enquirySubject;
      }
  }

  const params = {
    Source: 'support@abbostop.nl',
    Destination: {
        ToAddresses: ENV == 'dev' ? TO_EMAILS.split(',') : ['support@abbostop.nl']
    },
    ReplyToAddresses: [req.body.email],
    Message: {
      Subject: {
        Data: enquirySubject
      },
      Body: {
        Html: {
          Charset:"UTF-8",
          Data: `<div> <p style="margin=4px">Name: ${req.body.name} </p><p style="margin=4px"> Email : ${req.body.email} </p> <p style="margin=4px">${req.body.body}</p></div>`
        }
      }
    }
  };
  ses.sendEmail(params, (err, data) => {
    if (err) {
      res.json({
        data:err,
        status:false,
        Message:"failed"
      })
      console.log('Error sending email:', err);
    } else {

      
      res.json({
          data: data,
          status: true,
          Message: "success"
      })
      if (req.body.type == 'reviewForm') {
          return;
      }
      const emailBody = `<!DOCTYPE html>
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
                  
                  <p>Beste ${req.body.name},</p>
                  <p>
                    Hartelijk dank voor het invullen van ons contactformulier. We waarderen uw feedback, vragen of opmerkingen en willen u verzekeren dat elk bericht onze volle aandacht krijgt. 
                  </p>
                  <p>
                  Ons team is momenteel uw bericht aan het verwerken en we streven ernaar om binnen 2 tot 3 werkdagen te reageren. We begrijpen hoe belangrijk uw vragen en zorgen voor u zijn en waarderen het dat u de tijd heeft genomen om contact met ons op te nemen. We doen ons uiterste best om u zo snel en adequaat mogelijk van dienst te zijn.
 
                  </p>
                  <p>Bedankt voor het vertrouwen in Abbo Stop. We kijken ernaar uit om u verder te helpen!</p>
                  <p>Met vriendelijke groet,</p>
                  <p>Het Abbo Stop Team</p>
                </div>               
             
                </div>
                <div class="footer" >
                  <div class="logo" style="float:left; margin-top: 35px;">
                    <img src="cid:unique@kreata.ee"/>
                  </div>
                  <div class="email" style="float:right;">
                    <a href="mailto:support@abbostop.nl">support@abbostop.nl</a>
                  </div>
                </div>
                </div>
            </body>
          </html>
`

      sendEmail({to:req.body.email, subject:'Bedankt voor uw bericht aan Abbo Stop', body:emailBody});
      
      console.log('Email sent');
    }
  });
}

export const sendContactFromUnsubby= async(req,res)=>{

  const isGTokenVerified = await verifyReCaptchToken(req, 'v3', req.body.code);
  if (!isGTokenVerified) {
      console.log("Bodyyyyyyy", req.body?.formData)
      return res.json({
          status: false,
          type: "test",
          message: "Invalid data."
      })
  }

  if(!req.body.name || !req.body.email || !req.body.body){
    return res.json({
      message:'Please fill all fields.',
      status:false
    })
  }


  let supportEmail = 'support.de@unsubby.com';
  let enquirySubject = 'Kontaktformular Unsubby | Deutschland';
  const countryCode = req.body.countryCode ? req.body.countryCode.split('-')[1] : 'de';
  const languageCode = req.body.countryCode ? req.body.countryCode.split('-')[0] : 'de';
  if(req.body.countryCode){   
    supportEmail = SupportEmail[countryCode];
    if(countryCode=='fr'){
      enquirySubject = 'Formulaire de contact Unsubby | France';
    }else if(countryCode=='at'){
      enquirySubject = 'Kontaktformular Unsubby | Österreich';
    }else if(countryCode=='us'){
      enquirySubject = 'Unsubby Contact Form | USA';
    }
  }

  if (req.body.type == 'reviewForm') {
      enquirySubject = 'Review:' + enquirySubject;
      if (req.body.orderId) {
          enquirySubject = req.body.orderId + ' ' + enquirySubject;
      }
  }

  const params = {
    Source: supportEmail,
    Destination: {
      ToAddresses: ENV=='dev'? TO_EMAILS.split(',') : [supportEmail]
    },
    ReplyToAddresses: [req.body.email],
    Message: {
      Subject: {
        Data: enquirySubject
      },
      Body: {
        Html: {
          Charset:"UTF-8",
          Data: `<div> <p style="margin=4px">Name: ${req.body.name} </p>
              <p style="margin=4px"> Email : ${req.body.email} </p> <p style="margin=4px">${req.body.body}</p></div>`
        }
      }
    }
  };
  ses.sendEmail(params, async (err, data) => {
    if (err) {
      res.json({
        data:err,
        status:false,
        Message:"failed"
      })
      console.log('Error sending email:', err);
    } else {

      res.json({
        data:data,
        status:true,
        Message:"success"
      })

      if(req.body.type=='reviewForm'){
        return;
      }

      if (countryCode == 'us') {
          let {
              htmlContent,
              subject
          } = await EmailTemplate.getEmailFromDB('en', {
              type: "Customer",
              name: "contactUsAutoReply",
              countryCode: countryCode,
              languageCode: languageCode
          },{name:req.body.name})
          sendEmailUnsubby({to:req.body.email, replyTo:supportEmail, subject: subject, body:htmlContent});
          return;
      }

      if(supportEmail=='support.fr@unsubby.com'){
        const emailBody = `<!DOCTYPE html>
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
                  <p>Cher ${req.body.name},</p>
                  <p>
                    Merci d'avoir rempli notre formulaire de contact. Nous apprécions vos commentaires, vos questions ou vos remarques et nous tenons à vous assurer que chaque message reçoit toute notre attention. 
                  </p>
                  <p>
                    Notre équipe traite actuellement votre message et nous nous efforçons de répondre dans les 2 à 3 jours ouvrables. Nous comprenons l'importance de vos questions et préoccupations, et nous vous remercions d'avoir pris le temps de nous contacter. Nous ferons de notre mieux pour vous aider aussi rapidement et efficacement que possible.

                  </p>
                  <p>Merci de faire confiance à Unsubby. Nous sommes impatients de vous aider davantage !</p>
                  <p>Cordialement,</p>
                  <p>L'équipe Unsubby</p>
                 </div>              
             
                </div>
                <div class="footer" >
                  <div class="logo" style="float:left; margin-top: 35px;">
                    <img src="cid:uniqueu@kreata.ee"/>
                  </div>
                  <div class="email" style="float:right;">
                    <a href="mailto:${supportEmail}">${supportEmail}</a>
                  </div>
                </div>
                </div>
            </body>
          </html>
`

      sendEmailUnsubby({to:req.body.email, replyTo:supportEmail, subject:'Merci pour votre message à Unsubby', body:emailBody});

      }else{
          const emailBody = `<!DOCTYPE html>
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
                  <p>Liebe ${req.body.name},</p>
                  <p>
                    Vielen Dank, dass Sie unser Kontaktformular ausgefüllt haben. Wir freuen uns über Ihr Feedback, Ihre Fragen oder Kommentare und möchten Ihnen versichern, dass jede Nachricht unsere volle Aufmerksamkeit erhält. 
                  </p>
                  <p>
                    Unser Team bearbeitet derzeit Ihre Nachricht und wir bemühen uns, innerhalb von 2-3 Arbeitstagen zu antworten. Wir wissen, wie wichtig Ihnen Ihre Fragen und Anliegen sind, und danken Ihnen, dass Sie sich die Zeit genommen haben, uns zu kontaktieren. Wir werden unser Bestes tun, um Ihnen so schnell und angemessen wie möglich zu helfen.

                  </p>
                  <p>Danke, dass Sie Unsubby Ihr Vertrauen schenken. Wir freuen uns darauf, Ihnen weiterzuhelfen!</p>
                  <p>Mit freundlichen Grüßen,</p>
                  <p>Das Unsubby Team</p>
                 </div>              
             
                </div>
                <div class="footer" >
                  <div class="logo" style="float:left; margin-top: 35px;">
                    <img src="cid:uniqueu@kreata.ee"/>
                  </div>
                  <div class="email" style="float:right;">
                    <a href="mailto:${supportEmail}">${supportEmail}</a>
                  </div>
                </div>
                </div>
            </body>
          </html>
`

      sendEmailUnsubby({to:req.body.email, replyTo:supportEmail, subject:'Vielen Dank für Ihre Nachricht an Unsubby', body:emailBody});
      }
      

      
      console.log('Email sent');
    }
  });
}