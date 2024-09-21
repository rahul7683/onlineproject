import {
    SupportEmail, 
    CountryData
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
                  padding-top: 10px;
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
                  
                  <p>Bonjour ${params?.voornaam},</p>
                  <p>
                  Nous vous remercions d'avoir utilisé notre service de résiliation en ligne.
                  </p> 

                  <p>Nous vous confirmons par ce message que votre lettre de résiliation pour ${params.companyName} a été imprimée et expédiée avec succès. Voici les détails de votre résiliation:                  
                  </p>                  
                </div>
                <div class="body-section">
                  <div class="inner">
                    <h1>Résumé de votre résiliation</h1>
                    <h3 class="margintop">Informations sur le client</h3>                    
                    <table border="0" id="body-info">
                      <tbody>
                        <tr>
                          <td class="boldset"><strong>Nom:</strong></td>
                          <td>${params?.voornaam} ${
                              params?.achternaam
                            }</td>
                        </tr>
                        <tr>
                          <td class="boldset"><strong>Adresse:</strong></td>
                          <td>${params.Adres || params.adres}</td>
                        </tr>
                        <tr>
                          <td class="boldset"><strong>Adresse e-mail:</strong></td>
                          <td>${params?.Emailadres}</td>
                        </tr>                      
                        
                      </tbody>
                    </table>
                    
                  </div>
                </div>

                  <div class="body-section">
                  <div class="inner">
                    <h3 class="margintop">Informations sur l'entreprise </h3>
                    <table border="0" id="body-info">
                      <tbody>
                        <tr>
                          <td class="boldset"><strong>Nom de l'entreprise: </strong></td>
                          <td>${params?.companyName}</td>
                        </tr>
                        <tr>
                          <td class="boldset"><strong>Adresse:</strong></td>
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
                <p>Il se peut que que ${params?.companyName} mette un certain temps à traiter votre résiliation. Si vous avez des questions concernant votre résiliation ou son statut, nous vous recommandons de contacter directement ${params?.companyName}. </p>
                <div class="second-inner">
                  <p>
                    Vous pouvez consulter nos <a href="https://unsubby.com/${params.languageCode}-${params.countryCode}${CountryData[params.countryCode]['termsUrl']}/">Conditions Générales de Vente</a>  à tout moment sur notre site web. Cliquez <a href="${params.downloadUrl}">ici</a> pour télécharger votre lettre de résiliation.
                  </p>
                  <p>
                  Ceci est un e-mail généré automatiquement. Merci de ne pas répondre directement à ce message.  
                  </p>
                  <p>Vous avez des questions, des commentaires ou des suggestions?</p>
                  <p>
                    Consultez notre page d'assistance ou contactez notre service client à l'adresse
                    <a style="color:#0090e3;"
                    href="mailto:${supportEmail}">${supportEmail}</a>. Si vous avez des questions sur le statut de votre résiliation, nous vous recommandons de contacter directement l'entreprise auprès de laquelle vous avez résiliée votre contrate via notre service. 
                  </p>
                  <p>
                  <small style="color:grey" ;>Il s'agit d'un message automatique sans possibilité de réponse. Nous vous prions de ne pas envoyer de messages à cette adresse, car aucune réponse ne sera suivie. Vous pouvez nous contacter par e-mail à l'adresse <a style="color:#0090e3;" href="mailto:${supportEmail}">${supportEmail}</a>.
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
    return { htmlContent : htmlContent , subject : `Votre lettre de résiliation à ${params.companyName} a été envoyée!`};
}

export const  paymentConfirmationEmail = (params={})=>{
    let orderType = 'single';
    if (params.companies && params.companies.length > 1) {
        orderType = 'multiple';
    }
    let texts = {
        multiple: {
            paragraph1: 'Vos lettres de résiliation pour #companyName ont été traitées !',
            paragraph2:'Vos lettres de résiliation seront envoyées dès que possible. Le traitement de vos résiliations peut prendre quelques jours.',
            heading1: 'Résumé de vos commandes',
            sentence1: "Vous avez choisi d'expédier vos lettres de résiliation le plus rapidement possible et avez donc volontairement renoncé à votre droit de rétractation légal.",
            sentence2: "Si vous avez des questions sur le statut de vos résiliations, nous vous recommandons de contacter directement les entreprises auprès desquelles vous avez effectué ces résiliations."
        },
        single: {
            paragraph1: 'Votre lettre de résiliation #companyName a été traitée !',
            paragraph2:'Votre lettre de résiliation sera envoyée dès que possible. Le traitement de votre résiliation peut prendre quelques jours.',
            heading1: 'Résumé de votre commande',
            sentence1: "Vous avez choisi d'expédier votre lettre de résiliation le plus rapidement possible et avez donc volontairement renoncé à votre droit de rétractation légal.",
            sentence2: "Si vous avez des questions sur le statut de votre résiliation, nous vous recommandons de contacter directement l'entreprise auprès de laquelle vous avez effectué cette résiliation."
        }
    }
  let supportEmail = SupportEmail[params.countryCode];
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
          padding-top: 10px;
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
          
          <p>Bonjour ${params?.voornaam},</p>

          <p>
          <strong>${texts[orderType].paragraph1.replace('#companyName', params.companyName)}</strong>
          </p>`;
          
          if (params.isSepa) {
              htmlContent += `<p>Vous avez payé par ${params.paymentMethod}. Ce paiement unique de ${params.amount} sera traité et apparaîtra sur votre relevé avec la description « Unsubby via Mollie ».</p>
              <p>${texts[orderType].paragraph2}</p>`;
          } else {
              htmlContent += `<p>Vous avez payé par ${params.paymentMethod}. ${texts[orderType].paragraph2}</p>`;
          }
          htmlContent += `<p>Voici un récapitulatif des informations que vous avez fournies.</p>
        </div>
        <div class="body-section">
          <div class="inner">
            <h1>${texts[orderType].heading1}</h1>
            <h3 class="margintop">Lettre de résiliation pour ${params?.companyName}</h3>
            <table border="0" id="body-info">
              <tbody>
                <tr>
                  <td class="boldset"><strong>Nom:</strong></td>
                  <td>${params?.voornaam} ${
                      params?.achternaam
                    }</td>
                </tr>
                <tr>
                  <td class="boldset"><strong>Adresse:</strong></td>
                  <td>${params?.Adres || params?.adres}</td>
                </tr>
                <tr>
                  <td class="boldset"><strong>Adresse e-mail:</strong></td>
                  <td>${params?.Emailadres}</td>
                </tr>
                ${params?.klantnummer?`<tr>
                  <td class="boldset"><strong>Numéro client:</strong></td>
                  <td>${params?.klantnummer}</td>
                </tr>`:""}
                ${params?.reason?`<tr>
                <td class="boldset"><strong>Motif de la résiliation:</strong></td>
                <td>${params.reason}</td>
              </tr>`:""}
              </tbody>
            </table>

            <h3 class="margintop">Votre paiement</h3>
            <table border="0" id="body-info">
              <tbody>
               <tr>
                  <td class="boldset"><strong>Montant de la facture:</strong></td>
                  <td>${params.amount}</td>
               </tr>

              <tr>
                  <td class="boldset"><strong>Méthode de paiement:</strong></td>
                  <td>${params.paymentMethod}</td>
              </tr>

            </tbody>
           </table>
            
          </div>
        </div>
        <p>${texts[orderType].sentence1} Pour plus d'informations sur l'exclusion du droit de rétractation, veuillez consulter les conditions générales.</p>
        <div class="second-inner">
          <p>
            Nos <a href="https://unsubby.com/${params.languageCode}-${params.countryCode}${CountryData[params.countryCode]['termsUrl']}/">conditions générales </a> sont consultables à tout moment sur notre site Web. Cliquez sur le nom de l'entreprise pour télécharger votre lettre de résiliation : 
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
          <p>
            Il s'agit d'un e-mail généré automatiquement. Merci de ne pas répondre directement à ce message.
          </p>
          <p>Vous avez des questions, des commentaires ou des suggestions? </p>
          <p>
            Consultez notre page d'assistance ou contactez notre service client à l'adresse
            <a style="color:#0090e3;"
            href="mailto:${supportEmail}">${supportEmail}</a>. ${texts[orderType].sentence2}
          </p>
          <p>
            <div class="rating-box">
              <div class="truspilot-logo"> <img width="150px" src="cid:uniqueu@kreata2.ee"/></div>
              <hr/>
              &nbsp;
              <h3>Comment avez-vous vécu le processus d'annulation ?<h3>
                <p>Nous nous efforçons continuellement d'améliorer notre service, et votre contribution joue un rôle crucial dans cette démarche. Merci d'avoir pris le temps de partager votre expérience.</p>
                <a href="https://trustpilot.com/evaluate/unsubby.com" class="rating-a">
                <div href="" class="rating-star mt" >
                  <div class="rating-text">Rien à redire jusqu'à présent</div>
                  <div class="rating-star-5">★★★★★</div>
                </div>
              </a>
                <a href="https://trustpilot.com/evaluate/unsubby.com" class="rating-a">
                <div class="rating-star">
                  <div class="rating-text">Très bien</div>
                  <div class="rating-star-5">★★★★</div>
                </div>
              </a>
                <a href="mailto:${supportEmail}" class="rating-a">
                <div class="rating-star" >
                  <div class="rating-text" >Moyen</div>
                  <div class="rating-star-5">★★★</div>
                </div>
              </a>
                <a href="mailto:${supportEmail}" class="rating-a">
                <div class="rating-star">
                  <div class="rating-text">Inférieur à la moyenne</div>
                  <div class="rating-star-5">★★</div>
                </div>
                </a>
                <a href="mailto:${supportEmail}" class="rating-a">
                <div class="rating-star">
                  <div class="rating-text">Mauvais</div>
                  <div class="rating-star-5">★</div>
                </div>
              </a>
            </div>
          <small style="color:grey" ;>Il s'agit d'un message automatisé provenant d’une adresse noreply. Nous vous prions de ne pas envoyer de messages à cette adresse, car aucune réponse ne sera suivie. Vous pouvez nous contacter par e-mail à l'adresse <a style="color:#0090e3;" href="mailto:${supportEmail}">${supportEmail}</a>.
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

  return { htmlContent : htmlContent , subject :`Votre commande chez Unsubby a été traitée ! - Numéro de commande: ${params.orderId}`};

}