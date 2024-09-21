import {
    SupportEmail
} from '../../../utils/constant.js'


export const paymentReminder1 = (params = {}) => {

    let supportEmail = SupportEmail[params.countryCode];
    let htmlContent = `<!DOCTYPE html>

    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <style>
            .content-align {
                margin: 0px 100px;
            }
    
            body {
                font-size: 18px;
                color: #0d1c47;
                margin: 0px;
            }
    
            .mr {
                padding-right: 30px;
                padding-top: 6px;
                padding-bottom: 6px;
            }
    
            .table-card {
                width: 600px;
                padding: 25px;
                background: hsl(240, 33%, 96%);
                max-width: 100%;
                min-width: 300px;
            }
    
            @media screen and (min-width: 200px) and (max-width: 768px) {
                .content-align {
                    margin: 0px 10px;
                }
    
                body {
                    font-size: 14px;
                    color: #0d1c47;
                }
    
                .table-card {
                    width: auto;
                    padding: 25px;
                    background: hsl(240, 33%, 96%);
                    /* max-width: 100%; */
                }
            }
        </style>
    </head>
    
    <body>
        <div class="content-align" style="padding: 10px 5px; color: #0d1c47; text-align: justify;font-size: 18px;font-weight: 400;
      line-height: 24px;">
            <p><strong>ÉCHEC DU PAIEMENT: Veuillez payer le montant dû dès que possible. &nbsp;</strong></p>
    
            <div class="table-card">
                <table>
                    <tbody>
                        <tr>
                            <th class="mr">Statut du paiement:</th>
                            <th style="color:#cc0000">Échec du paiement</th>
                        </tr>
                        <tr>
                            <th class="mr">Numéro de commande:</th>
                            <td>${params.orderId}</td>
                        </tr>
                        <tr>
                            <th class="mr">Montant:</th>
                            <td>${params.reminderAmount}</td>
                        </tr>
                    </tbody>
                </table>
               
            </div>
    
            <p>&nbsp;</p>
    
    
            <p>Bonjour ${params.voornaam},&nbsp;</p>
    
    
    
            <p>Le ${params.orderDate} vous avez utilisé notre service de résiliation en ligne sur <a style="color:#0090e3;"
                    href="https://unsubby.com/${params.languageCode}-${params.countryCode}/" rel="noreferrer noopener" target="_blank">Unsubby.com</a>. Nous avons pris en charge votre résiliation chez ${params.companyName} et la lettre de résiliation correspondante a maintenant été imprimée et envoyée. Nous pouvons confirmer que votre lettre de résiliation a bien été correctement transmise et sera généralement traitée par les entreprises concernées dans un délai moyen de 30 jours.</p>
    
    
            <p>Cependant, nous avons appris que le prélèvement automatique que nous avons tenté d'effectuer n'a pas été accepté par votre banque. Cela peut être dû à différentes raisons, par exemple, vous avez entré le mauvais IBAN, votre solde est insuffisant ou le paiement a été refusé par votre banque.</p>
    
    
            <p>Comme vous êtes tenu de payer, car nous avons déjà fourni le service de résiliation et que cela nous a causé des frais, nous vous demandons de régler le montant dû de <strong> 29,95 € dans les 14 jours</strong> suivant la réception de cet e-mail. Si vous ne payez pas dans les 14 jours, nous serons contraints de <strong> facturer des frais administratifs de 15 €</strong>.</p>
    
            <p>Pour plus de facilité vous pouvez payer directement en cliquant sur le bouton ci-dessous.</p>


            <a style="color:#007bff;display: flex;justify-content: center;" href="${params.checkout}"><button style="background:#007bff;box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19); padding: 15px 40px;margin:10px 0px;color:white;outline:none; border:1px solid #007bff; border-radius: 25px;cursor: pointer; font-size:18px; font-weight: bold;" type="button">Payer la facture | ${params.reminderAmount}</button></a>
    
    
            <p>Si le bouton ci-dessus ne fonctionne pas, vous pouvez <a style="color:#0090e3;" href="${params.checkout}"> utiliser ce lien</a>.</p>
                    
    
            <p>Si vous avez des questions concernant l’échec du prélèvement automatique ou nos services en général, veuillez consulter notre page d'assistance ou contacter notre service clientèle à l'adresse <a style="color:#0090e3;"
                    href="mailto:${supportEmail}">${supportEmail}</a>.</p>

            <p>Nous sommes toujours prêts à vous aider.</p>
    
            <p>Cordialement,</br>L'équipe Unsubby </p>
    
    
            <p>&nbsp;</p>
    
            <small style="color:grey" ;>Il s'agit d'un message automatisé provenant d'une adresse noreply. Nous vous prions de ne pas répondre à cette adresse, car aucune réponse ne sera suivie. Vous pouvez nous contacter par e-mail à <a style="color:#0090e3;" href="mailto:${supportEmail}">${supportEmail}</a>.
            </small>
    
        </div>
    
        <div style=" height: 93px;
    
      background: #182c55;
    
      align-items: center;
    
      padding: 0px 25px;
    
      max-width: 100%;
    
      margin:0px auto;">
    
            <div class="logo" style="float:left; margin-top: 35px;">
    <a  href="https://unsubby.com/${params.languageCode}-${params.countryCode}/" rel="noreferrer noopener" target="_blank">  <img width="100px" src="cid:uniqueu@kreata1.ee"/>
            </a>
    
            </div>
    
            <p style="float:right; 
    
      color: #fff;
    
      text-align: justify;
    
      font-family: Verdana;
    
      font-size: 16px;
    
      font-style: normal;
    
      margin-top:35px;
    
      font-weight: 400;
    
      line-height: 24px;
    
      text-decoration: none;">
    
                ${supportEmail}
    
            </p>
    
        </div>
    </body>
    
    </html>`;

    return { htmlContent : htmlContent , subject : `ÉCHEC DU PAIEMENT: Veuillez payer le montant dû dès que possible.`};

}

export const paymentReminder2 = (params = {}) => {

    let supportEmail = SupportEmail[params.countryCode];
    let htmlContent = `<!DOCTYPE html>

    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <style>
            .content-align {
                margin: 0px 100px;
            }
    
            body {
                font-size: 18px;
                color: #0d1c47;
                margin: 0px;
            }
    
            .mr {
                padding-right: 30px;
                padding-top: 6px;
                padding-bottom: 6px;
            }
    
            .table-card {
                width: 600px;
                padding: 25px;
                background: hsl(240, 33%, 96%);
                max-width: 100%;
                min-width: 300px;
            }
    
            @media screen and (min-width: 200px) and (max-width: 768px) {
                .content-align {
                    margin: 0px 10px;
                }
    
                body {
                    font-size: 14px;
                    color: #0d1c47;
                }
    
                .table-card {
                    width: auto;
                    padding: 25px;
                    background: hsl(240, 33%, 96%);
                    /* max-width: 100%; */
                }
            }
        </style>
    </head>
    
    <body>
        <div class="content-align" style="padding: 10px 5px; color: #0d1c47; text-align: justify;font-size: 18px;font-weight: 400;
      line-height: 24px;">
            <p><strong>FRAIS DE GESTION: Un supplément de 15 € va vous être facturé.</strong></p>
    
            <div class="table-card">
                <table>
                    <tbody>
                        <tr>
                            <th class="mr">Statut du paiement:</th>
                            <th style="color:#cc0000">Échec du paiement</th>
                        </tr>
                        <tr>
                            <th class="mr">Numéro de commande:</th>
                            <td>${params.orderId}</td>
                        </tr>
                        <tr>
                            <th class="mr">Montant:</th>
                            <td>${params.reminderAmount}</td>
                        </tr>
                    </tbody>
                </table>
               
            </div>
    
            <p>&nbsp;</p>
    
    
            <p>Bonjour ${params.voornaam},&nbsp;</p>
    
    
    
            <p>Le ${params.orderDate}, vous avez créé une lettre de résiliation sur notre site web <a style="color:#0090e3;"
                    href="https://unsubby.com/${params.languageCode}-${params.countryCode}/" rel="noreferrer noopener" target="_blank">Unsubby.com</a> et nous l'avons envoyée à ${params.companyName}.</p>
    
            <p>Malgré un rappel de paiement précédent, nous n'avons toujours pas reçu de paiement de votre part à la date d’aujourd'hui. Par conséquent, nous sommes maintenant obligés, en plus du montant initial de 29,95 €, de facturer des <strong> frais de gestion de 15 €</strong>. Le montant total dû s'élève donc à<strong> ${params.reminderAmount}.</strong> Si le paiement n'est pas reçu <strong> dans les 7 jours, </strong> nous serons malheureusement obligés d'ajouter <strong>40 € de frais de recouvrement</strong> au montant initial de la facture.</p>
    
    
            <p>Pour plus de facilité, vous pouvez effectuer votre paiement directement en cliquant sur le bouton ci-dessous.</p>


            <a style="color:#007bff;display: flex;justify-content: center;" href="${params.checkout}"><button style="background:#007bff;box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19); padding: 15px 40px;margin:10px 0px;color:white;outline:none; border:1px solid #007bff;border-radius: 25px;cursor: pointer; font-size:18px; font-weight: bold;" type="button">Payer la facture | ${params.reminderAmount}</button></a>
    
    
            <p>Si le bouton ci-dessus ne fonctionne pas, vous pouvez <a style="color:#0090e3;" href="${params.checkout}">utiliser ce lien</a>.&nbsp;</p>
                    
    
            <p>Si vous avez des questions sur l’échec du prélèvement automatique ou nos services en général, veuillez consulter notre page d’assistance ou contacter notre service clientèle à l'adresse <a style="color:#0090e3;"
                    href="mailto:${supportEmail}">${supportEmail}</a>. Nous sommes toujours prêts à vous aider.&nbsp;</p>

                    
            <p>Nous comptons sur votre promptitude à traiter cette affaire et nous vous remercions par avance de votre compréhension et de votre collaboration. Si vous avez déjà effectué le paiement, veuillez ne pas tenir compte de ce message.</p>

            <p>Cordialement, </br>L'équipe Unsubby </p>
    
    
            <p>&nbsp;</p>
    
            <small style="color:grey" ;>Il s'agit d'un message automatisé provenant d'une adresse noreply. Nous vous prions de ne pas répondre à cette adresse, car aucune réponse ne sera suivie. Vous pouvez nous contacter par e-mail à <a style="color:#0090e3;" href="mailto:${supportEmail}">${supportEmail}</a>.
            </small>
    
        </div>
    
        <div style=" height: 93px;
    
      background: #182c55;
    
      align-items: center;
    
      padding: 0px 25px;
    
      max-width: 100%;
    
      margin:0px auto;">
    
            <div class="logo" style="float:left; margin-top: 35px;">
    
            <a  href="https://unsubby.com/${params.languageCode}-${params.countryCode}/" rel="noreferrer noopener" target="_blank">  <img width="100px" src="cid:uniqueu@kreata1.ee"/>
            </a>
    
            </div>
    
            <p style="float:right; 
    
      color: #fff;
    
      text-align: justify;
    
      font-family: Verdana;
    
      font-size: 16px;
    
      font-style: normal;
    
      margin-top:35px;
    
      font-weight: 400;
    
      line-height: 24px;
    
      text-decoration: none;">
    
                ${supportEmail}
    
            </p>
    
        </div>
    </body>
    
    </html>`;

    return { htmlContent : htmlContent , subject : `FRAIS DE GESTION: Un supplément de 15 € va vous être facturé`};


}

export const paymentReminder3 = (params = {}) => {

    let supportEmail = SupportEmail[params.countryCode];
    let htmlContent = `<!DOCTYPE html>

    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <style>
            .content-align {
                margin: 0px 100px;
            }
    
            body {
                font-size: 18px;
                color: #0d1c47;
                margin: 0px;
            }
    
            .mr {
                padding-right: 30px;
                padding-top: 6px;
                padding-bottom: 6px;
            }
    
            .table-card {
                width: 600px;
                padding: 25px;
                background: hsl(240, 33%, 96%);
                max-width: 100%;
                min-width: 300px;
            }
    
            @media screen and (min-width: 200px) and (max-width: 768px) {
                .content-align {
                    margin: 0px 10px;
                }
    
                body {
                    font-size: 14px;
                    color: #0d1c47;
                }
    
                .table-card {
                    width: auto;
                    padding: 25px;
                    background: hsl(240, 33%, 96%);
                    /* max-width: 100%; */
                }
            }
        </style>
    </head>
    
    <body>
        <div class="content-align" style="padding: 10px 5px; color: #0d1c47; text-align: justify;font-size: 18px;font-weight: 400;
      line-height: 24px;">
            <p><strong>FRAIS DE RECOUVREMENT: Un supplément de 40 € va vous être facturé.&nbsp;</strong></p>
    
            <div class="table-card">
                <table>
                    <tbody>
                        <tr>
                            <th class="mr">Statut du paiement:</th>
                            <th style="color:#cc0000">Échec du paiement</th>
                        </tr>
                        <tr>
                            <th class="mr">Numéro de commande:</th>
                            <td>${params.orderId}</td>
                        </tr>
                        <tr>
                            <th class="mr">Montant:</th>
                            <td>${params.reminderAmount}</td>
                        </tr>
                    </tbody>
                </table>
               
            </div>
    
            <p>&nbsp;</p>
    
    
            <p>Bonjour ${params.voornaam},&nbsp;</p>
    
    
    
            <p>Le ${params.orderDate}, vous avez créé une lettre de résiliation sur notre site web <a style="color:#0090e3;"
                    href="https://unsubby.com/${params.languageCode}-${params.countryCode}/" rel="noreferrer noopener" target="_blank">Unsubby.com</a> et nous l'avons envoyée à ${params.companyName}.</p>
    
    
            <p>C'est avec regret que nous constatons que malgré un rappel de paiement antérieur, nous n'avons toujours pas reçu de règlement de votre part. En raison de ce retard, votre facture initiale a été majorée de <strong> 40 € pour frais de recouvrement.</strong> Le montant total dû s'élève donc à <strong>${params.reminderAmount}</strong>.</p>
    

            <p>Nous vous prions instamment de payer le montant total de <strong> ${params.reminderAmount} dans les 7 jours </strong> suivant la réception de cet e-mail. Si nous ne recevons aucun paiement de votre part dans ce délai, nous pourrons être contraints de transmettre la réclamation à un huissier de justice. Veuillez noter que <strong>les frais pour engager un huissier de justice peuvent s’élever à plus de 750 €</strong> et seront entièrement à votre charge.</p>
    

            <a style="color:#007bff;display: flex;justify-content: center;" href="${params.checkout}"><button style="background:#007bff;box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19); padding: 15px 40px;margin:10px 0px;color:white;outline:none; border:1px solid #007bff;border-radius: 25px;cursor: pointer; font-size:18px; font-weight: bold;" type="button">Payer la facture | ${params.reminderAmount}</button></a>
    
    
            <p>Si le bouton ci-dessus ne fonctionne pas, vous pouvez <a style="color:#0090e3;" href="${params.checkout}"> utiliser ce lien</a>.</p>
                    
    
            <p>Si vous avez des questions concernant votre remboursement ou nos services, veuillez consulter notre page d'assistance ou contacter notre service client à l'adresse <a style="color:#0090e3;"
                    href="mailto:${supportEmail}">${supportEmail}</a>. Nous sommes toujours prêts à vous aider.</p>

                    
                    <p>Nous vous demandons instamment d'effectuer le paiement dès que possible afin d'éviter des frais supplémentaires et des mesures ultérieures. Si vous avez déjà effectué le paiement, veuillez ne pas tenir compte de ce message.</p>

            <p>Cordialement, </br>L'équipe Unsubby </p>
    
    
            <p>&nbsp;</p>
    
            <small style="color:grey" ;>Il s'agit d'un message automatisé provenant d'une adresse noreply. Nous vous prions de ne pas répondre à cette adresse, car aucune réponse ne sera suivie. Vous pouvez nous contacter par e-mail à <a style="color:#0090e3;" href="mailto:${supportEmail}">${supportEmail}</a>.
            </small>
    
        </div>
    
        <div style=" height: 93px;
    
      background: #182c55;
    
      align-items: center;
    
      padding: 0px 25px;
    
      max-width: 100%;
    
      margin:0px auto;">
    
            <div class="logo" style="float:left; margin-top: 35px;">
    
            <a  href="https://unsubby.com/${params.languageCode}-${params.countryCode}/" rel="noreferrer noopener" target="_blank">  <img width="100px" src="cid:uniqueu@kreata1.ee"/>
            </a>
    
            </div>
    
            <p style="float:right; 
    
      color: #fff;
    
      text-align: justify;
    
      font-family: Verdana;
    
      font-size: 16px;
    
      font-style: normal;
    
      margin-top:35px;
    
      font-weight: 400;
    
      line-height: 24px;
    
      text-decoration: none;">
    
                ${supportEmail}
    
            </p>
    
        </div>
    </body>
    
    </html>`;

    return { htmlContent : htmlContent , subject : `FRAIS DE RECOUVREMENT: Un supplément de 40 € va vous être facturé`};

}

export const paymentReminder4 = (params = {}) => {

    let supportEmail = SupportEmail[params.countryCode];
    let htmlContent = `<!DOCTYPE html>

    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <style>
            .content-align {
                margin: 0px 100px;
            }
    
            body {
                font-size: 18px;
                color: #0d1c47;
                margin: 0px;
            }
    
            .mr {
                padding-right: 30px;
                padding-top: 6px;
                padding-bottom: 6px;
            }
    
            .table-card {
                width: 600px;
                padding: 25px;
                background: hsl(240, 33%, 96%);
                max-width: 100%;
                min-width: 300px;
            }
    
            @media screen and (min-width: 200px) and (max-width: 768px) {
                .content-align {
                    margin: 0px 10px;
                }
    
                body {
                    font-size: 14px;
                    color: #0d1c47;
                }
    
                .table-card {
                    width: auto;
                    padding: 25px;
                    background: hsl(240, 33%, 96%);
                    /* max-width: 100%; */
                }
            }
        </style>
    </head>
    
    <body>
        <div class="content-align" style="padding: 10px 5px; color: #0d1c47; text-align: justify;font-size: 18px;font-weight: 400;
      line-height: 24px;">
            <p><strong>DERNIÈRE CHANCE: Évitez le transfert de votre demande.&nbsp;</strong></p>
    
            <div class="table-card">
                <table>
                    <tbody>
                        <tr>
                            <th class="mr">Statut du paiement:</th>
                            <th style="color:#cc0000">Échec du paiement</th>
                        </tr>
                        <tr>
                            <th class="mr">Numéro de commande:</th>
                            <td>${params.orderId}</td>
                        </tr>
                        <tr>
                            <th class="mr">Montant:</th>
                            <td>${params.reminderAmount}</td>
                        </tr>
                    </tbody>
                </table>
               
            </div>
    
            <p>&nbsp;</p>
    
    
            <p>Bonjour ${params.voornaam},&nbsp;</p>
    
    
    
            <p>Le ${params.orderDate}, vous avez créé une lettre de résiliation sur notre site <a style="color:#0090e3;"
                    href="https://unsubby.com/${params.languageCode}-${params.countryCode}/" rel="noreferrer noopener" target="_blank">unsubby.com</a> et nous l'avons envoyée à ${params.companyName}.</p>
    
    
            <p>Nous sommes désolés de constater que malgré plusieurs rappels de paiement, nous n'avons toujours pas reçu de paiement de votre part. Votre dette s’élève toujours à un montant total de<strong> ${params.reminderAmount}</strong>.</p>
    

            <p>Nous vous prions instamment de payer le montant <strong>total de ${params.reminderAmount} dans les 7 jours</strong> suivant la réception de cet e-mail. Si nous ne recevons aucun paiement de votre part dans ce délai, nous serons contraints de transmettre la demande à un huissier de justice. Veuillez noter que<strong> les frais liés à l'engagement d'un huissier de justice peuvent s’élever à plus de 750 €</strong> et seront entièrement à votre charge.</p>
  

            <a style="color:#007bff;display: flex;justify-content: center;" href="${params.checkout}"><button style="background:#007bff;box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19); padding: 15px 40px;margin:10px 0px;color:white;outline:none; border:1px solid #007bff;border-radius: 25px;cursor: pointer; font-size:18px; font-weight: bold;" type="button">Payer la facture | ${params.reminderAmount}</button></a>
    
    
            <p>Si le bouton ci-dessus ne fonctionne pas, vous pouvez <a style="color:#0090e3;" href="${params.checkout}">utiliser ce lien</a>.</p>
                    

             <p>Nous vous prions instamment d'effectuer le paiement dès que possible afin d'éviter des frais supplémentaires et des mesures ultérieures. Si vous avez déjà effectué le paiement, veuillez ne pas tenir compte de ce message.</p>

    
            <p>Si vous avez des questions concernant l'échec du prélèvement automatique ou nos services, veuillez consulter notre page d’assistance ou contacter notre service clientèle à l'adresse <a style="color:#0090e3;"
                    href="mailto:${supportEmail}">${supportEmail}</a>. Nous sommes toujours prêts à vous aider.</p>
    


            <p>Cordialement, </br>L'équipe Unsubby </p>
    
    
            <p>&nbsp;</p>
    
            <small style="color:grey" ;>Il s'agit d'un message automatisé provenant d'une adresse noreply. Nous vous prions de ne pas répondre à cette adresse, car aucune réponse ne sera suivie. Vous pouvez nous contacter par e-mail à <a style="color:#0090e3;" href="mailto:${supportEmail}">${supportEmail}</a>.
            </small>
    
        </div>
    
        <div style=" height: 93px;
    
      background: #182c55;
    
      align-items: center;
    
      padding: 0px 25px;
    
      max-width: 100%;
    
      margin:0px auto;">
    
            <div class="logo" style="float:left; margin-top: 35px;">
    
            <a  href="https://unsubby.com/${params.languageCode}-${params.countryCode}/" rel="noreferrer noopener" target="_blank">  <img width="100px" src="cid:uniqueu@kreata1.ee"/>
            </a>
    
            </div>
    
            <p style="float:right; 
    
      color: #fff;
    
      text-align: justify;
    
      font-family: Verdana;
    
      font-size: 16px;
    
      font-style: normal;
    
      margin-top:35px;
    
      font-weight: 400;
    
      line-height: 24px;
    
      text-decoration: none;">
    
                ${supportEmail}
    
            </p>
    
        </div>
    </body>
    
    </html>`;

    return { htmlContent : htmlContent , subject : `DERNIÈRE CHANCE: Évitez le transfert de votre demande`};

}

export const paymentReminder5 = (params = {}) => {

    let supportEmail = SupportEmail[params.countryCode];
    let htmlContent = `<!DOCTYPE html>

    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <style>
            .content-align {
                margin: 0px 100px;
            }
    
            body {
                font-size: 18px;
                color: #0d1c47;
                margin: 0px;
            }
    
            .mr {
                padding-right: 30px;
                padding-top: 6px;
                padding-bottom: 6px;
            }
    
            .table-card {
                width: 600px;
                padding: 25px;
                background: hsl(240, 33%, 96%);
                max-width: 100%;
                min-width: 300px;
            }
    
            @media screen and (min-width: 200px) and (max-width: 768px) {
                .content-align {
                    margin: 0px 10px;
                }
    
                body {
                    font-size: 14px;
                    color: #0d1c47;
                }
    
                .table-card {
                    width: auto;
                    padding: 25px;
                    background: hsl(240, 33%, 96%);
                    /* max-width: 100%; */
                }
            }
        </style>
    </head>
    
    <body>
        <div class="content-align" style="padding: 10px 5px; color: #0d1c47; text-align: justify;font-size: 18px;font-weight: 400;
      line-height: 24px;">
            <p><strong>DERNIÈRE CHANCE: Évitez le transfert de votre demande.&nbsp;</strong></p>
    
            <div class="table-card">
                <table>
                    <tbody>
                        <tr>
                            <th class="mr">Statut du paiement:</th>
                            <th style="color:#cc0000">Paiement échoué</th>
                        </tr>
                        <tr>
                            <th class="mr">Numéro de commande:</th>
                            <td>${params.orderId}</td>
                        </tr>
                        <tr>
                            <th class="mr">Montant:</th>
                            <td>${params.reminderAmount}</td>
                        </tr>
                    </tbody>
                </table>
               
            </div>
    
            <p>&nbsp;</p>
    
    
            <p>Bonjour ${params.voornaam},&nbsp;</p>
    
    
    
            <p>Le ${params.orderDate}, vous avez créé une lettre de résiliation sur notre site <a style="color:#0090e3;"
                    href="https://unsubby.com/${params.languageCode}-${params.countryCode}/" rel="noreferrer noopener" target="_blank">unsubby.com</a> et nous l'avons envoyée à ${params.companyName}.</p>
    
    
            <p>Nous sommes désolés de constater que malgré plusieurs rappels de paiement, nous n'avons toujours pas reçu de paiement de votre part. Vous avez toujours un montant total dû de<strong> ${params.reminderAmount}</strong>.</p>
    

            <p>Nous vous prions instamment de payer le montant <strong>total de ${params.reminderAmount} dans les 7 jours</strong> suivant la réception de cet e-mail. Si nous ne recevons aucun paiement de votre part dans ce délai, nous serons contraints de transmettre la demande à un huissier de justice. Veuillez noter que<strong> les frais liés à l'engagement d'un huissier de justice peuvent dépasser 750 €</strong> et seront entièrement à votre charge.</p>
  

            <a style="color:#007bff;display: flex;justify-content: center;" href="${params.checkout}"><button style="background:#007bff;box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19); padding: 15px 40px;margin:10px 0px;color:white;outline:none; border:1px solid #007bff;border-radius: 25px;cursor: pointer; font-size:18px; font-weight: bold;" type="button">Payer la facture | ${params.reminderAmount}</button></a>
    
    
            <p>Si le bouton ci-dessus ne fonctionne pas, vous pouvez <a style="color:#0090e3;" href="${params.checkout}">utiliser ce lien</a>.</p>
                    

             <p>Nous vous prions instamment d'effectuer le paiement dès que possible afin d'éviter des frais supplémentaires et des mesures ultérieures. Si vous avez déjà effectué le paiement avant de recevoir cet e-mail, veuillez ignorer cette notification.</p>

    
            <p>Si vous avez des questions concernant l'échec du prélèvement automatique ou nos services, veuillez consulter notre page d'aide ou contacter notre service clientèle à l'adresse <a style="color:#0090e3;"
                    href="mailto:${supportEmail}">${supportEmail}</a>. Nous sommes toujours prêts à vous aider.</p>
    


            <p>Cordialement,</br>L'équipe Unsubby </p>
    
    
            <p>&nbsp;</p>
    
            <small style="color:grey" ;>Il s'agit d'un message automatisé provenant d'une adresse noreply. Nous vous prions de ne pas répondre à cette adresse, car aucune réponse ne sera suivie. Vous pouvez nous contacter par e-mail à <a style="color:#0090e3;" href="mailto:${supportEmail}">${supportEmail}</a>.
            </small>
    
        </div>
    
        <div style=" height: 93px;
    
      background: #182c55;
    
      align-items: center;
    
      padding: 0px 25px;
    
      max-width: 100%;
    
      margin:0px auto;">
    
            <div class="logo" style="float:left; margin-top: 35px;">
    
            <a  href="https://unsubby.com/${params.languageCode}-${params.countryCode}/" rel="noreferrer noopener" target="_blank">  <img width="100px" src="cid:uniqueu@kreata1.ee"/>
            </a>
    
            </div>
    
            <p style="float:right; 
    
      color: #fff;
    
      text-align: justify;
    
      font-family: Verdana;
    
      font-size: 16px;
    
      font-style: normal;
    
      margin-top:35px;
    
      font-weight: 400;
    
      line-height: 24px;
    
      text-decoration: none;">
    
                ${supportEmail}
    
            </p>
    
        </div>
    </body>
    
    </html>`;

    return { htmlContent : htmlContent , subject : `DERNIÈRE CHANCE: Évitez le transfert de votre demande`};

}