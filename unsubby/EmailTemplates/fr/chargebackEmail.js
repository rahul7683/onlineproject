import {
    SupportEmail
} from '../../../utils/constant.js'

export const reminder1 = (params = {}) => {

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
            <p><strong>Rappel de paiement: Manquement à l'obligation de paiement. Prélèvement automatique annulé.&nbsp;</strong></p>
    
            <div class="table-card">
                <table>
                    <tbody>
                        <tr>
                            <th class="mr">Statut du paiement:</th>
                            <th style="color:#cc0000">Paiement annulé</th>
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
    
    
    
            <p>Le ${params.orderDate}, vous avez utilisé notre service de résiliation en ligne sur <a style="color:#0090e3;"
                    href="https://unsubby.com/${params.languageCode}-${params.countryCode}/" rel="noreferrer noopener" target="_blank">unsubby.com</a> et nous avons effectué la résiliation pour vous auprès de ${params.companyName}. Vous avez manqué à votre obligation de paiement en ne réglant pas le montant de <strong>${params.reminderAmount}</strong>.</p>
    
    
            <p>La lettre de résiliation concernée a été imprimée et envoyée aux entreprises concernées. Nous pouvons confirmer que votre lettre de résiliation a bien été correctement transmise et sera généralement traitée par les entreprises concernées dans un délai moyen de 30 jours.</p>
    
    
            <p>Pour vous assurer de respecter votre obligation de paiement, veuillez nous verser la somme de 
            <strong>${params.reminderAmount} dans les 14 jours</strong> suivant la réception de cet e-mail. Pour votre plus de facilité, vous pouvez effectuer le paiement via le lien ci-dessous. Si nous ne recevons aucun paiement de votre part dans les 14 jours, nous serons contraints de majorer le montant total de <strong>40 &euro; pour frais de recouvrement.</strong>
            </p>
    
    
            <a style="color:#007bff;display: flex;justify-content: center;" href="${params.checkout}"><button style="background:#007bff;box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19); padding: 15px 40px;margin:10px 0px;color:white;outline:none; border:1px solid #007bff;
    
      border-radius: 25px;cursor: pointer; font-size:18px; font-weight: bold;" type="button">Payer la facture | ${params.reminderAmount}</button></a>
    
    
            <p>Si le bouton ci-dessus ne fonctionne pas, vous pouvez <a style="color:#0090e3;" href="${params.checkout}">utiliser ce lien</a></p>
    
    
            <p>Nous vous prions de vous acquitter de votre obligation de paiement dès que possible et espérons ne pas avoir à prendre de mesures supplémentaires.&nbsp;</p>
    
    
            <p>Si vous avez des questions concernant votre remboursement ou nos services, veuillez consulter notre page d’assistance ou contacter notre service clientèle à l'adresse <a style="color:#0090e3;"
                    href="mailto:${supportEmail}">${supportEmail}</a>. Nous sommes toujours prêts à vous aider.&nbsp;</p>
    
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

        return { htmlContent : htmlContent , subject : `Manquement à paiement: Refus de l'obligation de paiement. Prélèvement automatique annulé.`};

}

export const reminder2 = (params = {}) => {

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
            <p><strong>Frais de recouvrement: Un supplément de 40 € vous a été facturé.&nbsp;</strong></p>
    
            <div class="table-card">
                <table>
                    <tbody>
                        <tr>
                            <th class="mr">Statut du paiement:</th>
                            <th style="color:#cc0000">Paiement annulé</th>
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
    
    
    
            <p>Le ${params.orderDate}, vous avez fait un achat sur notre site web <a style="color:#0090e3;"
                    href="https://unsubby.com/${params.languageCode}-${params.countryCode}/" rel="noreferrer noopener" target="_blank">Unsubby.com</a> et créé une lettre de résiliation que nous avons envoyée à ${params.companyName}.</p>
    
            <p>Nous regrettons de constater que malgré plusieurs rappels de paiement, nous n'avons toujours pas reçu de règlement de votre part. En raison de ce retard, la facture initiale a été majorée de <strong>40 € pour frais de recouvrement.</strong> Le montant total dû s'élève donc désormais à <strong>${params.reminderAmount}.</strong> </p>
    
            <p>Nous vous prions instamment de régler le montant total de <strong>${params.reminderAmount} dans les 7 jours </strong>suivant la réception de cet e-mail. Si nous ne recevons aucun paiement de votre part dans ce délai, nous pourrons être contraints de transmettre la demande à un huissier de justice. Veuillez noter <strong>que les frais engagés pour la désignation d'un huissier de justice peuvent s’élever à plus de 750 € </strong>et seront entièrement à votre charge.</p>

            <a style="color:#007bff;display: flex;justify-content: center;" href="${params.checkout}"><button style="background:#007bff;box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19); padding: 15px 40px;margin:10px 0px;color:white;outline:none; border:1px solid #007bff;
    
      border-radius: 25px;cursor: pointer; font-size:18px; font-weight: bold;" type="button">Payer la facture | ${params.reminderAmount}</button></a>
    
    
            <p>Si le bouton ci-dessus ne fonctionne pas, vous pouvez <a style="color:#0090e3;" href="${params.checkout}">utiliser ce lien</a>.</p>
    
    
            <p>Nous vous prions instamment d'effectuer le paiement dès que possible afin d'éviter des frais supplémentaires et des mesures ultérieures. Si vous avez déjà effectué le paiement, veuillez ne pas tenir compte de ce message.</p>
    
    
            <p>Si vous avez des questions concernant l’échec du prélèvement automatique  ou nos services en général, veuillez consulter notre page d'assistance ou contacter notre service clientèle à l'adresse <a style="color:#0090e3;"
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

        return { htmlContent : htmlContent , subject : `Les frais de recouvrement: Un supplément de 40 € vous a été facturé`};


}

export const reminder3 = (params = {}) => {


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
            <p><strong>DERNIÈRE CHANCE: Empêchez le transfert de votre créance.</strong></p>
    
            <div class="table-card">
                <table>
                    <tbody>
                        <tr>
                            <th class="mr">Statut du paiement:</th>
                            <th style="color:#cc0000">Paiement annulé</th>
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
                    href="https://unsubby.com/${params.languageCode}-${params.countryCode}/" rel="noreferrer noopener" target="_blank">Unsubby.com</a> que nous avons envoyée à ${params.companyName} en votre nom.</p>
    
            <p>Nous regrettons de vous informer que malgré plusieurs rappels de paiement, nous n'avons toujours pas reçu de règlement de votre part. Le montant total dû est de <strong>${params.reminderAmount} .</strong></p>
    
    
            <p>Nous vous prions instamment de régler le montant total <strong>de ${params.reminderAmount} dans les 7 jours</strong> suivant la réception de cet e-mail. Si nous ne recevons aucun paiement de votre part dans ce délai, nous serons contraints de transmettre l'affaire à un huissier de justice. Veuillez noter que <strong>les frais engagés pour la désignation d'un huissier de justice peuvent s’élever à plus de 750 €</strong> et seront entièrement à votre charge.</p>

            <a style="color:#007bff;display: flex;justify-content: center;" href="${params.checkout}"><button style="background:#007bff;box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19); padding: 15px 40px;margin:10px 0px;color:white;outline:none; border:1px solid #007bff;border-radius: 25px;cursor: pointer; font-size:18px; font-weight: bold;" type="button">Payer la facture | ${params.reminderAmount}</button></a>
    
    
            <p>Si le bouton ci-dessus ne fonctionne pas, vous pouvez <a style="color:#0090e3;" href="${params.checkout}">utiliser ce lien</a>.</p>
    
    
            <p>Nous vous prions instamment d'effectuer le paiement dès que possible afin d'éviter des frais supplémentaires et des mesures ultérieures. Si vous avez déjà effectué le paiement, veuillez ne pas tenir compte de ce message.</p>
    
    
            <p>Si vous avez des questions concernant votre remboursement ou nos services, veuillez consulter notre page d’assistance ou contacter notre service clientèle à l'adresse <a style="color:#0090e3;"
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

        return { htmlContent : htmlContent , subject : `DERNIÈRE CHANCE: Empêchez le transfert de votre créance`};


}

export const reminder4 = (params = {}) => {
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
            <p><strong>DERNIÈRE CHANCE: Empêchez le transfert de votre créance.</strong></p>
    
            <div class="table-card">
                <table>
                    <tbody>
                        <tr>
                            <th class="mr">Statut du paiement:</th>
                            <th style="color:#cc0000">Paiement annulé</th>
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
                    href="https://unsubby.com/${params.languageCode}-${params.countryCode}/" rel="noreferrer noopener" target="_blank">Unsubby.com</a> que nous avons ensuite envoyée à ${params.companyName} en votre nom.</p>
    
            <p>Nous regrettons de vous informer que malgré plusieurs rappels de paiement, nous n'avons toujours pas reçu de règlement de votre part. Vous avez toujours un montant total dû de <strong>${params.reminderAmount} .</strong></p>
    
    
            <p>Nous vous prions instamment de régler le montant total <strong>de ${params.reminderAmount} dans les 7 jours</strong> suivant la réception de cet e-mail. Si nous ne recevons aucun paiement de votre part dans ce délai, nous serons contraints de transmettre la demande à un huissier de justice. Veuillez noter que <strong>les frais engagés pour la désignation d'un huissier de justice peuvent dépasser 750 €</strong> et seront entièrement à votre charge.</p>

            <a style="color:#007bff;display: flex;justify-content: center;" href="${params.checkout}"><button style="background:#007bff;box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19); padding: 15px 40px;margin:10px 0px;color:white;outline:none; border:1px solid #007bff;
    
      border-radius: 25px;cursor: pointer; font-size:18px; font-weight: bold;" type="button">Payer la facture | ${params.reminderAmount}</button></a>
    
    
            <p>Si le bouton ci-dessus ne fonctionne pas, vous pouvez <a style="color:#0090e3;" href="${params.checkout}">utiliser ce lien</a>.</p>
    
    
            <p>Nous vous prions instamment d'effectuer le paiement dès que possible afin d'éviter des frais supplémentaires et des mesures supplémentaires. Si vous avez déjà effectué le paiement avant de recevoir cet e-mail, veuillez ignorer cette communication.</p>
    
    
            <p>Si vous avez des questions concernant votre remboursement ou nos services, veuillez consulter notre page d'aide ou contacter notre service clientèle à l'adresse <a style="color:#0090e3;"
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

        return { htmlContent : htmlContent , subject : `DERNIÈRE CHANCE: Empêchez le transfert de votre créance`};
}

export const reminder5 = (params = {}) => {
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
            <p><strong>DERNIÈRE CHANCE: Empêchez le transfert de votre créance.</strong></p>
    
            <div class="table-card">
                <table>
                    <tbody>
                        <tr>
                            <th class="mr">Statut du paiement:</th>
                            <th style="color:#cc0000">Paiement annulé</th>
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
                    href="https://unsubby.com/${params.languageCode}-${params.countryCode}/" rel="noreferrer noopener" target="_blank">Unsubby.com</a> que nous avons ensuite envoyée à ${params.companyName} en votre nom.</p>
    
            <p>Nous regrettons de vous informer que malgré plusieurs rappels de paiement, nous n'avons toujours pas reçu de règlement de votre part. Vous avez toujours un montant total dû de <strong>${params.reminderAmount} .</strong></p>
    
    
            <p>Nous vous prions instamment de régler le montant total <strong>de ${params.reminderAmount} dans les 7 jours</strong> suivant la réception de cet e-mail. Si nous ne recevons aucun paiement de votre part dans ce délai, nous serons contraints de transmettre la demande à un huissier de justice. Veuillez noter que <strong>les frais engagés pour la désignation d'un huissier de justice peuvent dépasser 750 €</strong> et seront entièrement à votre charge.</p>

            <a style="color:#007bff;display: flex;justify-content: center;" href="${params.checkout}"><button style="background:#007bff;box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19); padding: 15px 40px;margin:10px 0px;color:white;outline:none; border:1px solid #007bff;
    
      border-radius: 25px;cursor: pointer; font-size:18px; font-weight: bold;" type="button">Payer la facture | ${params.reminderAmount}</button></a>
    
    
            <p>Si le bouton ci-dessus ne fonctionne pas, vous pouvez <a style="color:#0090e3;" href="${params.checkout}">utiliser ce lien</a>.</p>
    
    
            <p>Nous vous prions instamment d'effectuer le paiement dès que possible afin d'éviter des frais supplémentaires et des mesures supplémentaires. Si vous avez déjà effectué le paiement avant de recevoir cet e-mail, veuillez ignorer cette communication.</p>
    
    
            <p>Si vous avez des questions concernant votre remboursement ou nos services, veuillez consulter notre page d'aide ou contacter notre service clientèle à l'adresse <a style="color:#0090e3;"
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

        return { htmlContent : htmlContent , subject : `DERNIÈRE CHANCE: Empêchez le transfert de votre créance`};
}