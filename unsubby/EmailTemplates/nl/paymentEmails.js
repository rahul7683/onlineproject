import {
    SupportEmail
} from '../../../utils/constant.js'

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
                  
                  <p>Beste ${params?.voornaam},</p>
                  <p>
                  Nogmaals bedankt voor het gebruikmaken van onze online opzegservice.
                  </p> 

                  <p>
                  Met deze e-mail bevestigen wij dat uw opzegbrief voor ${params.companyName} met succes geprint en verzonden is. Hier zijn de details van uw opzegging: 
                  </p>                  
                </div>
                <div class="body-section">
                  <div class="inner">
                    <h1>Overzicht van je opzegging</h1>
                    <h3 class="margintop">Klantgegevens</h3>                    
                    <table border="0" id="body-info">
                      <tbody>
                        <tr>
                          <td class="boldset"><strong>Naam:</strong></td>
                          <td>${params?.voornaam} ${
                              params?.achternaam
                            }</td>
                        </tr>
                        <tr>
                          <td class="boldset"><strong>Adres:</strong></td>
                          <td>${params.Adres || params.adres}</td>
                        </tr>
                        <tr>
                          <td class="boldset"><strong>E-mailadres:</strong></td>
                          <td>${params?.Emailadres}</td>
                        </tr>                      
                        
                      </tbody>
                    </table>
                    
                  </div>
                </div>

                  <div class="body-section">
                  <div class="inner">
                    <h3 class="margintop">Bedrijfsgegevens </h3>
                    <table border="0" id="body-info">
                      <tbody>
                        <tr>
                          <td class="boldset"><strong>Naam bedrijf: </strong></td>
                          <td>${params?.companyName}</td>
                        </tr>
                        <tr>
                          <td class="boldset"><strong>Adres:</strong></td>
                          <td>`;

                  params.companyAddress?.split(",")
                      .map((address, index) => {
                          return (
                             htmlContent +=`<p className="address-linehight">
                               ${address}
                               </p>`
                          );
                      });
                htmlContent+= `</td>
                        </tr>                      
                        
                      </tbody>
                    </table>
                    
                  </div>
                </div>
                <p>U heeft uw opzegging betaald via domiciliëring. Wij schrijven binnen 2 werkdagen het bedrag van €29,95 van uw rekening af. U ziet dan op uw afschrift 'Unsubby via Mollie’. </p>
                <p>Het kan enige tijd duren voordat ${params?.companyName} uw opzegging heeft verwerkt. Mocht u vragen hebben over uw opzegging of de status ervan, raden wij u aan rechtstreeks contact op te nemen met >${params?.companyName}. </p>
                <div class="second-inner">
                  <p>
                    Onze <a href="https://unsubby.com/algemene-voorwaarden/">algemene voorwaarden</a> kunt u op elk gewenst moment
                    op de website bekijken. Klik <a href="${params.downloadUrl}">hier</a> om je opzegbrief te
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
                    href="mailto:${supportEmail}">${supportEmail}</a>. Indien u vragen heeft over de status van uw
                    opzegging, raden wij u aan rechtstreeks contact op te nemen met het
                    bedrijf dat u via ons heeft opgezegd.
                  </p>
                  <p>
                  <small style="color:grey" ;>Dit is een geautomatiseerd noreply-bericht. Wij verzoeken u vriendelijk geen berichten te verzenden naar dit noreply-adres, aangezien er geen opvolging op reacties plaatsvindt. U kunt ons per e-mail bereiken op <a style="color:#0090e3;" href="mailto:${supportEmail}">${supportEmail}</a>.
                  </small>
                  </p>
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
    return { htmlContent : htmlContent , subject : `Uw opzeggingsbrief naar ${params.companyName} is verzonden!`};

}


export const  paymentConfirmationEmail = (params={})=>{
  let supportEmail = SupportEmail[params.countryCode];
  const { letterContent, company, downloadUrl, order_id } = params;
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
                  <p>U heeft uw opzegging betaald via een <strong>eenmalige</strong> domiciliëring. Wij schrijven binnen 2 werkdagen eenmalig het bedrag van €29,95 van uw rekening af. U ziet dan op uw afschrift 'Unsubby via Mollie’ staan.</p>
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
                          <td>SEPA Domiciliëring (eenmalig)</td>
                      </tr>

                    </tbody>
                   </table>
                    
                  </div>
                </div>
                <p>U heeft bij uw opzegging ervoor gekozen om de brief zo snel mogelijk te verzenden en heeft daarom vrijwillig afstand gedaan van uw wettelijk recht op herroeping. Voor meer informatie over de uitsluiting van het herroepingsrecht kunt u de algemene voorwaarden doornemen.  </p>
                <div class="second-inner">
                  <p>
                    Onze <a href="https://unsubby.com/algemene-voorwaarden/">algemene voorwaarden</a> kunt u op elk gewenst moment
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
                    href="mailto:${supportEmail}">${supportEmail}</a>. Indien u vragen heeft over de status van uw
                    opzegging, raden wij u aan rechtstreeks contact op te nemen met het
                    bedrijf dat u via ons heeft opgezegd.
                  </p>
                  <p>
                  <small style="color:grey" ;>Dit is een geautomatiseerd noreply-bericht. Wij verzoeken u vriendelijk geen berichten te verzenden naar dit noreply-adres, aangezien er geen opvolging op reacties plaatsvindt. U kunt ons per e-mail bereiken op <a style="color:#0090e3;" href="mailto:${supportEmail}">${supportEmail}</a>.
                  </small>
                  </p>
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

  return { htmlContent : htmlContent , subject :`Uw bestelling bij Unsubby is verwerkt! – Ordernummer: ${order_id}`};

}