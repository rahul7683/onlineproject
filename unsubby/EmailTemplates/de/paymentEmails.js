import {
    SupportEmail
} from '../../../utils/constant.js';

export const paymentConfirmationEmail = (params = {}) => {

    let orderType = 'single';
    if (params.companies && params.companies.length > 1) {
        orderType = 'multiple';
    }
    let texts = {
        multiple: {
            word1: 'wurden',
            paragraph1: 'Ihre Kündigungsschreiben werden schnellstmöglich verschickt. Es kann mehrere Tage dauern, bis Ihre Stornierungen bearbeitet werden.',
            heading1: 'Übersicht Ihrer Stornierungen',
            sentence1: 'Sie haben sich bei Ihren Kündigungen für eine möglichst schnelle Absendung der Briefe entschieden und haben daher freiwillig auf Ihr gesetzliches Widerrufsrecht verzichtet.',
            sentence2: 'Wenn Sie Fragen zum Status Ihrer Stornierungen haben, empfehlen wir Ihnen, sich direkt an die Unternehmen zu wenden, bei denen Sie storniert haben.'
        },
        single: {
            word1: 'wurde',
            paragraph1: 'Ihr Kündigungsschreiben wird Ihnen schnellstmöglich zugesandt. Es kann einige Tage dauern, bis Ihre Kündigung bearbeitet wird.',
            heading1: 'Übersicht über Ihre Stornierung',
            sentence1: 'Sie haben sich bei Ihrer Kündigung für eine möglichst schnelle Absendung des Briefes entschieden und haben daher freiwillig auf Ihr gesetzliches Widerrufsrecht verzichtet.',
            sentence2: 'Wenn Sie Fragen zum Status Ihrer Stornierung haben, empfehlen wir Ihnen, sich über uns direkt an das Unternehmen zu wenden, das Sie storniert hat.'
        }
    }

    let supportEmail = SupportEmail[params.countryCode];
    let htmlContent = `<!DOCTYPE html>
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
                font-family: Verdana;
                font-size: 18px;
                font-style: normal;
                font-weight: 700;
                line-height: 24px;
                padding: 7px 0px;
              }
              #body-info tr td:last-child {
                color: #0d1c47;
                font-family: Verdana;
                font-size: 18px;
                font-style: normal;
                font-weight: 400;
                line-height: 24px;
                padding: 7px 0px;
                word-break: break-all;
              }
              #body-info1 {
                width: 100%;
                padding-top: 20px;
              }
              #body-info1 tr td {
                width: 50%;
              }
              #body-info1 tr td:first-child {
                color: #0d1c47;
                font-family: Verdana;
                font-size: 18px;
                font-style: normal;
                font-weight: 700;
                line-height: 24px;
                padding: 7px 0px;
              }
              #body-info1 tr td:last-child {
                color: #0d1c47;
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
                #body-info1 tr td:first-child {
                  font-size: 14px;
                  font-weight: 700;
                }
                #body-info1 tr td:last-child {
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
                
                <p>Lieber ${params?.voornaam},</p>
              
                <p><strong>Ihr ${params?.companyName}-Kündigungsschreiben ${texts[orderType].word1} bearbeitet!</strong></p>`;

                if (params.isSepa) {
                    htmlContent += `<p>Die Zahlung erfolgte über ${params.paymentMethod}. Diese einmalige Zahlung von ${params.amount} wird verarbeitet und erscheint auf Ihrem Kontoauszug mit der Beschreibung „Unsubby über Mollie“.</p>
                        <p>${texts[orderType].paragraph1}</p>`;
                } else {
                    htmlContent += `<p>Die Zahlung erfolgte über ${params.paymentMethod}. ${texts[orderType].paragraph1}</p>`;
                }
                htmlContent += `<p>Um den Status Ihres Kündigungsschreibens zu verfolgen, klicken Sie bitte auf den untenstehenden Schaltfläche:</p>
                <p><span style="font-family: verdana, geneva, sans-serif;"><a style="color: #007bff; display: flex; justify-content: center;" href="https://unsubby.com/${params.languageCode}-${params.countryCode}/letter-tracking/${params.orderId}"><button style="background: #007bff; box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19); padding: 15px 40px; margin: 10px 0px; color: white; outline: none; border: 1px solid #007bff; border-radius: 25px; cursor: pointer; font-size: 18px; font-weight: bold;" type="button">Verfolgen Sie Ihren Brief</button></a></span></p>
                <p>Hier finden Sie eine Übersicht Ihrer eingegebenen Daten.  </p> 
              </div>
              <div class="body-section">
                <div class="inner">
                  <h1>${texts[orderType].heading1}</h1>
                  <h3 class="margintop">Kündigungsschreiben von ${params?.companyName}</h3>
                  <table border="0" id="body-info">
                    <tbody>
                      <tr>
                        <td class="boldset"><strong>Name:</strong></td>
                        <td>${params?.voornaam}</td>
                      </tr>
                      <tr>
                        <td class="boldset"><strong>Adresse:</strong></td>
                        <td>${params?.Adres || params?.adres}</td>
                      </tr>
                      <tr>
                        <td class="boldset"><strong>Emailadres:</strong></td>
                        <td>${params?.Emailadres}</td>
                      </tr>
                      <!-- ${params?.klantnummer?`<tr>
                        <td class="boldset"><strong>Klantnummer:</strong></td>
                        <td>${params?.klantnummer}</td>
                      </tr>`:""} -->
                      ${params?.reason?`<tr>
                      <td class="boldset"><strong>
                        Grund für die Stornierung:</strong></td>
                      <td>${params.reason}</td>
                    </tr>`:""}
                  </tbody>
                </table>

                <h3 style="margin-top: 20px;">Ihre Zahlung</h3>

            <table id="body-info1">
              <tbody>
                <tr>
                  <td class="boldset"><strong>Rechnungsbetrag:</strong></td>
                  <td>${params.amount}</td>
                </tr>
                <tr>
                      <td class="boldset"><strong>Zahlungsmethode:</strong></td>
                      <td>${params.paymentMethod}</td>
                    </tr>
                    
                  </tbody>
                </table>
                  </div>
                </div>
               <p>${texts[orderType].sentence1} Weitere Informationen zum Ausschluss des Widerrufsrechts finden Sie in den Allgemeinen Geschäftsbedingungen.  </p>
              <p>Unser <a href="https://unsubby.com/${params.languageCode}-${params.countryCode}/allgemeinen-geschaftsbedingungen/">Geschäftsbedingungen</a> jederzeit auf der Website einsehbar. Klicken Sie auf den Firmennamen, um Ihr Kündigungsschreiben herunterzuladen:
              `;
            params.companies
              .map((company, index) => {
                      if(params.companies.length>1 && index > 0){
                        htmlContent += `,`;  
                      } 
                      htmlContent += ` <a href="${company.downloadUrl}">${company.companyName}</a>`
                  return htmlContent;
              });
            htmlContent += `.</p>
            <div class="second-inner">
                <p>
                Dies ist eine automatisch generierte E-Mail. Leider können wir nicht auf diese Nachricht antworten. 
                </p>
                <p>Haben Sie Fragen, Anmerkungen oder Anregungen?</p>
                <p>
                 Konsultieren Sie unsere Helpdesk-Seite oder kontaktieren Sie unseren Kundenservice unter <a style="color:#0090e3;" href="mailto:${supportEmail}">${supportEmail}</a>. ${texts[orderType].sentence2} 
                </p>
              </div>
              <div class="rating-box">
                <div class="truspilot-logo"> <img width="150px" src="cid:uniqueu@kreata2.ee"/></div>
                <hr/>
                &nbsp;
                <h3>Wie haben Sie den Kündigungsprozess empfunden?<h3>
                  <p>Wir bemühen uns kontinuierlich, unseren Service zu verbessern, und Ihr Feedback spielt dabei eine entscheidende Rolle. Vielen Dank, dass Sie sich die Zeit genommen haben, Ihre Erfahrungen zu teilen.</p>
                  <a href="https://trustpilot.com/evaluate/unsubby.com" class="rating-a">
                  <div href="" class="rating-star mt"  onclick="window.location='https://trustpilot.com/evaluate/unsubby.com';">
                    <div class="rating-text">Bisher nichts zu beanstanden</div>
                    <div class="rating-star-5">★★★★★</div>
                  </div>
                  <a href="https://trustpilot.com/evaluate/unsubby.com" class="rating-a">
                  <div class="rating-star">
                    <div class="rating-text">Sehr gut</div>
                    <div class="rating-star-5">★★★★</div>
                  </div>
                </a>
                  <a href="mailto:${supportEmail}" class="rating-a">
                  <div class="rating-star">
                    <div class="rating-text" >Durchschnittlich</div>
                    <div class="rating-star-5">★★★</div>
                  </div>
                </a>
                  <a href="mailto:${supportEmail}" class="rating-a">
                  <div class="rating-star">
                    <div class="rating-text">Unterdurchschnittlich</div>
                    <div class="rating-star-5">★★</div>
                  </div>
                </a>
                  <a href="mailto:${supportEmail}" class="rating-a">
                  <div class="rating-star">
                    <div class="rating-text">Schlecht</div>
                    <div class="rating-star-5">★</div>
                  </div>
                  </a>
              </div>
              <p> <small style="color:grey;">Dies ist eine automatisierte Noreply-Nachricht. Wir bitten Sie höflich, keine Nachrichten an diese Noreply-Adresse zu senden, da auf Antworten keine Rückverfolgung erfolgt. Sie können uns per E-Mail unter <a style="color:#0090e3;" href="mailto:${supportEmail}">${supportEmail}</a> erreichen.
              </small></p>
              </div>
          
              <div class="footer" >
                <div class="logo" style="float:left; margin-top: 35px;">
                <a  href="https://unsubby.com/${params.languageCode}-${params.countryCode}/" rel="noreferrer noopener" target="_blank">  <img width="100px" src="cid:uniqueu@kreata1.ee"/>
              </a>
                </div>
                <div class="email" style="float:right;">
                  <a href="mailto:${supportEmail}">${supportEmail}</a>
                </div>
              </div>
              </div>
          </body>
        </html>`;

return {htmlContent:htmlContent, subject : `Ihre Bestellung bei Unsubby wurde bearbeitet! - Bestellnummer: ${params.orderId}`};

}
export const letterSentEmail = (params = {}) => {

    let supportEmail = SupportEmail[params.countryCode];

    let htmlContent = `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Letter sent confirmation email</title>
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
            
            <p>Sehr geehrter ${params?.voornaam},</p>
            <p>
            Vielen Dank, dass Sie unseren Online-Kündigungsservice genutzt haben. 
            </p> 

            <p>
           Mit dieser E-Mail bestätigen wir Ihnen, dass Ihr Kündigungsschreiben für ${params.companyName} erfolgreich gedruckt und versandt wurde.
           </p>
           <p>Um den Status Ihres Kündigungsschreibens zu verfolgen, klicken Sie bitte auf den untenstehenden Schaltfläche:</p>
           <p><span style="font-family: verdana, geneva, sans-serif;"><a style="color: #007bff; display: flex; justify-content: center;" href="https://unsubby.com/${params.languageCode}-${params.countryCode}/letter-tracking/${params.orderId}"><button style="background: #007bff; box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19); padding: 15px 40px; margin: 10px 0px; color: white; outline: none; border: 1px solid #007bff; border-radius: 25px; cursor: pointer; font-size: 18px; font-weight: bold;" type="button">Verfolgen Sie Ihren Brief</button></a></span></p>
           <p>Hier finden Sie die Details Ihrer Kündigung:</p>                  
          </div>
          <div class="body-section">
            <div class="inner">
              <h1>Zusammenfassung Ihrer Kündigung </h1>
              <h3 class="margintop">Angaben zum Kunden </h3>                    
              <table border="0" id="body-info">
                <tbody>
                  <tr>
                    <td class="boldset"><strong>Name:</strong></td>
                    <td>${params?.voornaam}</td>
                  </tr>
                  <tr>
                    <td class="boldset"><strong>Adresse:</strong></td>
                    <td>${params.Adres || params.adres}</td>
                  </tr>
                  <tr>
                    <td class="boldset"><strong>E-Mail Adresse:</strong></td>
                    <td>${params?.Emailadres}</td>
                  </tr>                      
                  
                </tbody>
              </table>
              
            </div>
          </div>

            <div class="body-section">
            <div class="inner">
              <h3 class="margintop">Angaben zum Unternehmen </h3>
              <table border="0" id="body-info">
                <tbody>
                  <tr>
                    <td class="boldset"><strong>Name des Unternehmens: </strong></td>
                    <td>${params?.companyName}</td>
                  </tr>
                  <tr>
                    <td class="boldset"><strong>Anschrift:</strong></td>
                    <td>`;

params.companyAddress?.split(",")
  .map((address, index) => {
      return (
          htmlContent += `<p className="address-linehight">
                         ${address}
                         </p>`
      );
  });
htmlContent += `</td>
                  </tr>                      
                  
                </tbody>
              </table>
              
            </div>
          </div>          
          <p>Es kann einige Zeit dauern, bis ${params?.companyName} Ihre Kündigung bearbeitet hat. Wenn Sie Fragen zu Ihrer Kündigung oder deren Status haben, empfehlen wir Ihnen, sich direkt an ${params?.companyName} zu wenden.</p>
          <div class="second-inner">
            <p>
              Sie können unsere <a href="https://unsubby.com/${params.languageCode}-${params.countryCode}/allgemeinen-geschaftsbedingungen/">Allgemeinen Geschäftsbedingungen</a> jederzeit auf der Website einsehen. Klicken Sie <a href="${params.downloadUrl}">hier</a>, um Ihr Kündigungsschreiben herunterzuladen. 
            </p>
            <p>
              Dies ist eine automatisch generierte E-Mail, eine Antwort auf diese Nachricht können wir leider nicht beantworten. 
            </p>
            <p>Haben Sie Fragen, Kommentare oder Anregungen?</p>
            <p>
              Konsultieren Sie unsere Helpdesk-Seite oder kontaktieren Sie unseren Kundendienst über <a style="color:#0090e3;" href="mailto:${supportEmail}">${supportEmail}</a>. Wenn Sie Fragen zum Status Ihrer Kündigung haben, empfehlen wir Ihnen, sich direkt an das Unternehmen zu wenden, das Sie über uns gekündigt haben. 
            </p>
            <p> <small style="color:grey;">Dies ist eine automatisierte Noreply-Nachricht. Wir bitten Sie höflich, keine Nachrichten an diese Noreply-Adresse zu senden, da auf Antworten keine Rückverfolgung erfolgt. Sie können uns per E-Mail unter <a style="color:#0090e3;" href="mailto:${supportEmail}">${supportEmail}</a> erreichen.
          </small></p>
          </div>
          </div>
          <div class="footer" >
            <div class="logo" style="float:left; margin-top: 35px;">
            <a  href="https://unsubby.com/${params.languageCode}-${params.countryCode}/" rel="noreferrer noopener" target="_blank">  <img width="100px" src="cid:uniqueu@kreata1.ee"/>
            </a>
            </div>
            <div class="email" style="float:right;">
              <a href="mailto:${supportEmail}">${supportEmail}</a>
            </div>
          </div>
          </div>
      </body>
    </html>
`;
    return {htmlContent:htmlContent, subject : `Ihr Kündigungsschreiben an ${params.companyName} wurde gesendet!`};

}