export const paymentConfirmationEmail = (params = {}) => {

  let orderType = 'single';
    if (params.companies && params.companies.length > 1) {
        orderType = 'multiple';
    }
    let texts = {
        multiple: {
            paragraph1: 'Uw opzegbrieven worden zo snel mogelijk verstuurd. Het kan enkele dagen duren voordat uw opzeggingen verwerkt zijn.',
            heading1: 'Overzicht van uw opzeggingen',
            sentence1: 'U heeft bij uw opzeggingen ervoor gekozen om de brieven zo snel mogelijk te verzenden en heeft daarom vrijwillig afstand gedaan van uw wettelijk recht op herroeping.',
            sentence2: 'Indien u vragen heeft over de status van uw opzeggingen, raden wij u aan rechtstreeks contact op te nemen met het bedrijf dat u via ons heeft opgezegd.',
            word1:'opzegbrieven zijn'
        },
        single: {
            paragraph1: 'Uw opzegbrief wordt zo snel mogelijk verstuurd. Het kan enkele dagen duren voordat uw opzegging verwerkt is.',
            heading1: 'Overzicht van uw opzegging',
            sentence1: 'U heeft bij uw opzegging ervoor gekozen om de brief zo snel mogelijk te verzenden en heeft daarom vrijwillig afstand gedaan van uw wettelijk recht op herroeping.',
            sentence2: 'Indien u vragen heeft over de status van uw opzegging, raden wij u aan rechtstreeks contact op te nemen met het bedrijf dat u via ons heeft opgezegd.',
            word1:'opzegbrief is'
        }
    }

  let htmlContent=`<!DOCTYPE html>
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
                  color: #ff0000  ;
                  font-size: 30px;
                }
                .rating-star-2{
                  text-align: center;
                  color: #d78111  ;
                  font-size: 30px;
                }
                .rating-star-3{
                  text-align: center;
                  color: #fff531  ;
                  font-size: 30px;
                }
                .rating-star-4{
                  text-align: center;
                  color: #36e14f  ;
                  font-size: 30px;
                }
                .rating-star-5{
                  text-align: center;
                  font-size: 30px;
                  color: #06850c  ;
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
                  Bedankt voor het gebruikmaken van onze online opzegservice.
                  </p>
                  <p><strong>Uw ${params?.companyName}-${texts[orderType].word1} verwerkt!</strong></p>`;
                  if (params.isSepa) {
                      htmlContent += ` <p>De betaling is gedaan via ${params.paymentMethod}. Deze <strong>eenmalige betaling</strong> van ${params.amount} wordt verwerkt en zal op uw bankafschrift verschijnen met de beschrijving "${params.paymentStatement}".</p>
                        <p>${texts[orderType].paragraph1}</p>`
                  } else {
                      htmlContent += `<p>De betaling is gedaan via ${params.paymentMethod}. ${texts[orderType].paragraph1}</p>`;

                  }

                htmlContent += `<p>Hierbij een overzicht van uw ingevulde gegevens.</p>
                </div>
                <div class="body-section">
                  <div class="inner">
                    <h1>${texts[orderType].heading1}</h1>
                    <h3 class="margintop">Opzegbrief ${params?.companyName}</h3>
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
                          <td>${params?.Adres || params?.adres}</td>
                        </tr>
                        <tr>
                          <td class="boldset"><strong>E-mailadres:</strong></td>
                          <td>${params?.Emailadres}</td>
                        </tr> 
                      </tbody>
                    </table>

                    <h3 class="margintop">Uw Betaling</h3>
                    <table border="0" id="body-info">
                      <tbody>
                       <tr>
                          <td class="boldset"><strong>Factuur bedrag:</strong></td>
                          <td>${params.amount}</td>
                       </tr>

                      <tr>
                          <td class="boldset"><strong>Betaalmethode:</strong></td>
                          <td>${params.paymentMethod}</td>
                      </tr>

                    </tbody>
                   </table>
                    
                  </div>
                </div>
                <p>${texts[orderType].sentence1} Voor meer informatie over de uitsluiting van het herroepingsrecht kunt u de algemene voorwaarden doornemen.  </p>
                <div class="second-inner">
                  <p>
                    Onze <a href="https://abbostop.nl/algemene-voorwaarden/">algemene voorwaarden</a> kunt u op elk gewenst moment
                    op de website bekijken. Klik op de bedrijfsnaam om je opzegbrief te downloaden: `;
            params.companies
              .map((company, index) => {
                      if(params.companies.length>1 && index > 0){
                        htmlContent += `,`;  
                      } 
                      htmlContent += ` <a href="${company.downloadUrl}">${company.companyName}</a>`
                  return htmlContent;
              });
            htmlContent += `.</p>
                  <p>
                    Dit is een automatisch gegenereerde e-mail, een reply op dit bericht
                    kunnen we helaas niet beantwoorden.
                  </p>
                  <p>Heeft u vragen, opmerkingen of suggesties?</p>
                  <p>
                    Raadpleeg onze helpdesk pagina of contacteer onze klantenservice via
                    <a style="color:#0090e3;"
                    href="mailto:support@abbostop.nl">support@abbostop.nl</a>. ${texts[orderType].sentence2}
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
`;
return {htmlContent:htmlContent, subject:`Uw bestelling bij Abbo Stop is verwerkt! – Ordernummer: ${params.orderId}`};
}
export const letterSentEmail = (params = {}) => {
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
                <p>Het kan enige tijd duren voordat ${params?.companyName} uw opzegging heeft verwerkt. Mocht u vragen hebben over uw opzegging of de status ervan, raden wij u aan rechtstreeks contact op te nemen met ${params?.companyName}. </p>
                <div class="second-inner">
                  <p>
                    Onze <a href="https://abbostop.nl/algemene-voorwaarden/">algemene voorwaarden</a> kunt u op elk gewenst moment
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
                    href="mailto:support@abbostop.nl">support@abbostop.nl</a>. Indien u vragen heeft over de status van uw
                    opzegging, raden wij u aan rechtstreeks contact op te nemen met het
                    bedrijf dat u via ons heeft opgezegd.
                  </p>
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
`;
return htmlContent;
}