
import {
    SupportEmail
} from '../../../utils/constant.js';


export const paymentReminder1 = (params = {}) => {

    let supportEmail = SupportEmail[params.countryCode];

    let htmlContent = `<!DOCTYPE html>

    <head>
        <meta charset="UTF-8" />
        <meta name=

        "viewport" content="width=device-width, initial-scale=1.0" />
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
            <p><strong>ZAHLUNG FEHLGESCHLAGEN: Bezahlen Sie den ausstehenden Betrag so schnell wie möglich. &nbsp;</strong></p>
    
            <div class="table-card">
                <table>
                    <tbody>
                        <tr>
                            <th class="mr">Zahlungsstatus:</th>
                            <th style="color:#cc0000">Zahlung fehlgeschlagen</th>
                        </tr>
                        <tr>
                            <th class="mr">Bestellnummer:</th>
                            <td>${params.orderId}</td>
                        </tr>
                        <tr>
                            <th class="mr">Betrag:</th>
                            <td>${params.reminderAmount}</td>
                        </tr>
                    </tbody>
                </table>
               
            </div>
    
            <p>&nbsp;</p>
    
    
            <p>Sehr geehrter ${params.voornaam},&nbsp;</p>
    
    
    
            <p>Am ${params.orderDate} haben Sie unseren Online-Kündigungsservice auf <a style="color:#0090e3;"
                    href="https://unsubby.com/${params.languageCode}-${params.countryCode}/" rel="noreferrer noopener" target="_blank">unsubby.com</a>  genutzt. Wir haben uns um Ihre Kündigung bei ${params.companyName} gekümmert und das entsprechende Kündigungsschreiben wurde nun ausgedruckt und versandt. Wir können bestätigen, dass Ihr Kündigungsschreiben korrekt übermittelt wurde und in der Regel innerhalb von 30 Tagen von den betreffenden Unternehmen bearbeitet wird.</p>
    
    
            <p>Wir haben jedoch erfahren, dass die einmalige Lastschrift, die wir ausführen wollten, von Ihrer Bank nicht akzeptiert wurde. Dies kann verschiedene Gründe haben, z. B. haben Sie die falsche IBAN eingegeben, Ihr Guthaben reicht nicht aus oder die Zahlung wurde von Ihrer Bank abgelehnt.</p>
    
    
            <p>Da Sie zur Zahlung verpflichtet sind, weil wir die Kündigungsdienstleistung bereits erbracht haben und uns dadurch Kosten entstanden sind, bitten wir Sie, den ausstehenden Betrag von <strong> ${params.reminderAmount} innerhalb von 14 Tagen </strong> nach Erhalt dieser E-Mail zu zahlen. Wenn Sie nicht innerhalb von 14 Tagen zahlen, sehen wir uns gezwungen, eine <strong> Verwaltungsgebühr von 15 &euro; zu erheben. </strong></p>
    
            <p>Zu Ihrer Bequemlichkeit können Sie direkt bezahlen, indem Sie auf die Schaltfläche unten klicken. </p>
    
            <a style="color:#007bff;display: flex;justify-content: center;" href="${params.checkout}"><button style="background:#007bff;box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19); padding: 15px 40px;margin:10px 0px;color:white;outline:none; border:1px solid #007bff;
    
      border-radius: 25px;cursor: pointer; font-size:18px; font-weight: bold;" type="button">Rechnung bezahlen | ${params.reminderAmount}</button></a>
    
    
            <p>Wenn die obige Schaltfläche nicht funktioniert, können Sie <a style="color:#0090e3;" href="${params.checkout}"> diesen Link verwenden</a>.&nbsp;</p>
    
    
            <p>Sollten Sie Fragen zur fehlgeschlagenen automatischen Abbuchung oder zu unseren Dienstleistungen haben, konsultieren Sie bitte unsere Helpdesk-Seite oder kontaktieren Sie unseren Kundenservice über <a style="color:#0090e3;"
                    href="mailto:${supportEmail}">${supportEmail}</a>. Wir sind immer bereit, Ihnen weiterzuhelfen.&nbsp;</p>
    
            <p>Wir hoffen, dass Sie diese Angelegenheit umgehend bearbeiten werden, und danken Ihnen im Voraus für Ihr Verständnis und Ihre Mitarbeit. &nbsp;</p>

            <p>Mit freundlichen Grüßen,</br>Das Unsubby Team &nbsp;</p>
    
    
            <p>&nbsp;</p>
    
            <small style="color:grey;">Dies ist eine automatisierte Noreply-Nachricht. Wir bitten Sie höflich, keine Nachrichten an diese Noreply-Adresse zu senden, da auf Antworten keine Rückverfolgung erfolgt. Sie können uns per E-Mail unter <a style="color:#0090e3;" href="mailto:${supportEmail}">${supportEmail}</a> erreichen.
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

return {htmlContent:htmlContent, subject : 'ZAHLUNG FEHLGESCHLAGEN: Bezahlen Sie den ausstehenden Betrag so schnell wie möglich'};;
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
            <p><strong>VERWALTUNGSKOSTEN: Es wird ein Zuschlag von 15 &euro; erhoben. &nbsp;</strong></p>
    
            <div class="table-card">
                <table>
                    <tbody>
                        <tr>
                            <th class="mr">Zahlungsstatus:</th>
                            <th style="color:#cc0000">Zahlung fehlgeschlagen</th>
                        </tr>
                        <tr>
                            <th class="mr">Bestellnummer:</th>
                            <td>${params.orderId}</td>
                        </tr>
                        <tr>
                            <th class="mr">Betrag:</th>
                            <td>${params.reminderAmount}</td>
                        </tr>
                    </tbody>
                </table>
               
            </div>
    
            <p>&nbsp;</p>
    
    
            <p>Sehr geehrter ${params.voornaam},&nbsp;</p>
    
    
    
            <p>Am ${params.orderDate} haben Sie über unsere Website <a style="color:#0090e3;"
                    href="https://unsubby.com/${params.languageCode}-${params.countryCode}/" rel="noreferrer noopener" target="_blank">unsubby.com</a>  ein Kündigungsschreiben erstellt und es von uns an ${params.companyName} senden lassen. &nbsp;</p>
    
    
            <p>Trotz einer früheren Zahlungserinnerung haben wir bis heute keine Zahlung von Ihnen erhalten. Daher sehen wir uns nun gezwungen, zusätzlich zu dem ursprünglichen Betrag von ${params.reminderAmount} eine <strong> Verwaltungskosten von 15 &euro; zu berechnen</strong>. Damit beläuft sich der ausstehende Gesamtbetrag auf <strong> ${params.reminderAmount}</strong>. Sollten wir <strong>innerhalb von 7 Tagen </strong> keine Zahlung von Ihnen erhalten, müssen wir leider den ursprünglichen Rechnungsbetrag um weitere <strong> 40 &euro; Inkassogebühren </strong> erhöhen.</p>
    

            <p>Zu Ihrer Bequemlichkeit können Sie direkt bezahlen, indem Sie auf die Schaltfläche unten klicken.</p>
    
    
            <a style="color:#007bff;display: flex;justify-content: center;" href="${params.checkout}"><button style="background:#007bff;box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19); padding: 15px 40px;margin:10px 0px;color:white;outline:none; border:1px solid #007bff;
    
      border-radius: 25px;cursor: pointer; font-size:18px; font-weight: bold;" type="button">Rechnung bezahlen | ${params.reminderAmount}</button></a>
    
    
            <p>Wenn die obige Schaltfläche nicht funktioniert, können Sie <a style="color:#0090e3;" href="${params.checkout}"> diesen Link verwenden</a>.&nbsp;</p>
    
    
            <p>Sollten Sie Fragen zur fehlgeschlagenen automatischen Abbuchung oder zu unseren Dienstleistungen haben, konsultieren Sie bitte unsere Helpdesk-Seite oder kontaktieren Sie unseren Kundenservice über <a style="color:#0090e3;"
                    href="mailto:${supportEmail}">${supportEmail}</a>. Wir sind immer bereit, Ihnen weiterzuhelfen.&nbsp;</p>
    
            <p>Wir vertrauen darauf, dass Sie diese Angelegenheit umgehend bearbeiten, und danken Ihnen im Voraus für Ihr Verständnis und Ihre Mitarbeit. Wenn Sie die Zahlung bereits geleistet haben, bevor Sie diese E-Mail erhalten haben, ignorieren Sie bitte diese E-Mail.&nbsp;</p>

            <p>Mit freundlichen Grüßen,<br/>Das Unsubby Team &nbsp;</p>
    
    
            <p>&nbsp;</p>
    
            <small style="color:grey;">Dies ist eine automatisierte Noreply-Nachricht. Wir bitten Sie höflich, keine Nachrichten an diese Noreply-Adresse zu senden, da auf Antworten keine Rückverfolgung erfolgt. Sie können uns per E-Mail unter <a style="color:#0090e3;" href="mailto:${supportEmail}">${supportEmail}</a> erreichen.
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

return {htmlContent:htmlContent, subject : 'VERWALTUNGSKOSTEN: Es wird ein Zuschlag von 15 € erhoben.'};

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
            <p><strong>INKASSOKOSTEN: Es wird ein Zuschlag von 40 &euro; erhoben.&nbsp;</strong></p>
    
            <div class="table-card">
                <table>
                    <tbody>
                        <tr>
                            <th class="mr">Zahlungsstatus:</th>
                            <th style="color:#cc0000">Zahlung fehlgeschlagen</th>
                        </tr>
                        <tr>
                            <th class="mr">Bestellnummer:</th>
                            <td>${params.orderId}</td>
                        </tr>
                        <tr>
                            <th class="mr">Betrag:</th>
                            <td>${params.reminderAmount}</td>
                        </tr>
                    </tbody>
                </table>
               
            </div>
    
            <p>&nbsp;</p>
    
    
            <p>Sehr geehrter ${params.voornaam},&nbsp;</p>
    
    
    
            <p>Am ${params.orderDate} haben Sie über unsere Website Folgendes gekauft <a style="color:#0090e3;"
                    href="https://unsubby.com/${params.languageCode}-${params.countryCode}/" rel="noreferrer noopener" target="_blank">unsubby.com</a> ein Kündigungsschreiben erstellt und es von uns an ${params.companyName} senden lassen. &nbsp;</p>
    
    
            <p>Mit Bedauern müssen wir feststellen, dass wir trotz mehrerer Zahlungserinnerungen immer noch keine Zahlung von Ihnen erhalten haben. Aufgrund dieser Verzögerung wurde die ursprüngliche Rechnung nun um <strong> 40 &euro; für Inkassokosten </strong> erhöht. Damit beläuft sich der ausstehende Gesamtbetrag auf <strong> ${params.reminderAmount}</strong>. </p>
    

            <p>Wir bitten Sie dringend, den vollen Betrag von <strong> ${params.reminderAmount} innerhalb von 7 Tagen </strong> nach Erhalt dieser E-Mail zu zahlen. Sollten wir innerhalb dieser Frist keine Zahlung von Ihnen erhalten, können wir die Forderung an einen Gerichtsvollzieher übergeben. Bitte beachten Sie, dass <strong> die Kosten für die Beauftragung eines Gerichtsvollziehers mehr als 750 &euro; betragen können </strong> und vollständig zu Ihren Lasten gehen werden.</p>
    
    
            <a style="color:#007bff;display: flex;justify-content: center;" href="${params.checkout}"><button style="background:#007bff;box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19); padding: 15px 40px;margin:10px 0px;color:white;outline:none; border:1px solid #007bff;
    
      border-radius: 25px;cursor: pointer; font-size:18px; font-weight: bold;" type="button">Rechnung bezahlen | ${params.reminderAmount}</button></a>
    
    
            <p>Wenn die obige Schaltfläche nicht funktioniert, können Sie <a style="color:#0090e3;" href="${params.checkout}"> diesen Link verwenden</a>.&nbsp;</p>
    
            <p>Wir bitten Sie dringend, die Zahlung so bald wie möglich vorzunehmen, um weitere Gebühren und Maßnahmen zu vermeiden. Wenn Sie die Zahlung bereits vor Erhalt dieser E-Mail geleistet haben, ignorieren Sie bitte diese E-Mail.&nbsp;</p>
    
            <p>Sollten Sie Fragen zur fehlgeschlagenen automatischen Abbuchung oder zu unseren Dienstleistungen haben, konsultieren Sie bitte unsere Helpdesk-Seite oder kontaktieren Sie unseren Kundenservice über <a style="color:#0090e3;"
                    href="mailto:${supportEmail}">${supportEmail}</a>. Wir sind immer bereit, Ihnen weiterzuhelfen.&nbsp;</p>
    
      

            <p>Mit freundlichen Grüßen,</br>Das Unsubby Team &nbsp;</p>
    
    
            <p>&nbsp;</p>
    
            <small style="color:grey;">Dies ist eine automatisierte Noreply-Nachricht. Wir bitten Sie höflich, keine Nachrichten an diese Noreply-Adresse zu senden, da auf Antworten keine Rückverfolgung erfolgt. Sie können uns per E-Mail unter <a style="color:#0090e3;" href="mailto:${supportEmail}">${supportEmail}</a> erreichen.
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

return {htmlContent:htmlContent, subject : 'INKASSOKOSTEN: Es wird ein Zuschlag von 40 € erhoben.'};;
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
            <p><strong>LETZTE MÖGLICHKEIT: Verhindern Sie, dass Ihre Forderung übertragen wird.&nbsp;</strong></p>
    
            <div class="table-card">
                <table>
                    <tbody>
                        <tr>
                            <th class="mr">Zahlungsstatus:</th>
                            <th style="color:#cc0000">Zahlung fehlgeschlagen</th>
                        </tr>
                        <tr>
                            <th class="mr">Bestellnummer:</th>
                            <td>${params.orderId}</td>
                        </tr>
                        <tr>
                            <th class="mr">Betrag:</th>
                            <td>${params.reminderAmount}</td>
                        </tr>
                    </tbody>
                </table>
               
            </div>
    
            <p>&nbsp;</p>
    
    
            <p>Sehr geehrter ${params.voornaam},&nbsp;</p>
    
    
    
            <p>Am ${params.orderDate} haben Sie über unsere Website <a style="color:#0090e3;"
                    href="https://unsubby.com/${params.languageCode}-${params.countryCode}/" rel="noreferrer noopener" target="_blank">unsubby.com</a> einen Kündigungsbrief erstellt und diesen durch uns an ${params.companyName} senden lassen. &nbsp;</p>
    
    
            <p>Wir müssen leider feststellen, dass wir trotz mehrerer Zahlungserinnerungen immer noch keine Zahlung von Ihnen erhalten haben. Sie haben immer noch einen ausstehenden Gesamtbetrag von <strong>${params.reminderAmount}</strong>.</p>
    

            <p>Wir möchten Sie dringend bitten, den vollen Betrag von <strong> ${params.reminderAmount} innerhalb von 7 Tagen </strong>nach Erhalt dieser E-Mail zu zahlen. Sollten wir innerhalb dieser Frist keine Zahlung von Ihnen erhalten, sind wir gezwungen, die Forderung an einen Gerichtsvollzieher zu übergeben. Bitte beachten Sie, dass sich<strong> die Kosten für die Inanspruchnahme eines Gerichtsvollziehers auf mehr als 750 &euro; betragen können </strong> und vollständig zu Ihren Lasten gehen werden.</p>
    
    
            <a style="color:#007bff;display: flex;justify-content: center;" href="${params.checkout}"><button style="background:#007bff;box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19); padding: 15px 40px;margin:10px 0px;color:white;outline:none; border:1px solid #007bff;
    
      border-radius: 25px;cursor: pointer; font-size:18px; font-weight: bold;" type="button">Rechnung bezahlen | ${params.reminderAmount}</button></a>
    
    
            <p>Wenn die obige Schaltfläche nicht funktioniert, können Sie <a style="color:#0090e3;" href="${params.checkout}"> diesen Link verwenden</a>.&nbsp;</p>
    
            <p>Wir bitten Sie dringend, die Zahlung so bald wie möglich vorzunehmen, um weitere Gebühren und Maßnahmen zu vermeiden. Wenn Sie die Zahlung bereits vor Erhalt dieser E-Mail geleistet haben, ignorieren Sie bitte diese E-Mail.&nbsp;</p>
    
            <p>Sollten Sie Fragen zur fehlgeschlagenen automatischen Abbuchung oder zu unseren Dienstleistungen haben, konsultieren Sie bitte unsere Helpdesk-Seite oder kontaktieren Sie unseren Kundenservice über <a style="color:#0090e3;"
                    href="mailto:${supportEmail}">${supportEmail}</a>. Wir sind immer bereit, Ihnen weiterzuhelfen.&nbsp;</p>
    
      

            <p>Mit freundlichen Grüßen,</br>Das Unsubby Team &nbsp;</p>
    
    
            <p>&nbsp;</p>
    
            <small style="color:grey;">Dies ist eine automatisierte Noreply-Nachricht. Wir bitten Sie höflich, keine Nachrichten an diese Noreply-Adresse zu senden, da auf Antworten keine Rückverfolgung erfolgt. Sie können uns per E-Mail unter <a style="color:#0090e3;" href="mailto:${supportEmail}">${supportEmail}</a> erreichen.
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

return {htmlContent:htmlContent, subject : 'LETZTE MÖGLICHKEIT: Verhindern Sie, dass Ihre Forderung übertragen wird'};
}

export const paymentReminder5 = (params = {}) => {
    
    let supportEmail = SupportEmail[params.countryCode];

    let htmlContent = `<div style="padding: 10px 35px;"><p><strong>LETZTE MÖGLICHKEIT: Ihr Anspruch wird übertragen </strong></p>

 
    <p>&nbsp;</p>

    <table style="cell">
    <tr>
    <td style="padding: 5px;"><strong>Zahlungsstatus</strong></td>
    <td style="padding: 5px;"><strong><span style="color:#cc0000">Zahlung fehlgeschlagen</span></strong></td>
    </tr>
    <tr>
    <td style="padding: 5px;"><strong>Bestellung</strong></td>
    <td style="padding: 5px;"><strong>${params.orderId} </strong></td>
    </tr>
    <tr>
    <td style="padding: 5px;"><strong>Betrag</strong></td>
    <td style="padding: 5px;"><strong>${params.reminderAmount}</strong></td>
    </tr>
    </table>


    <p>&nbsp;</p>


    <p>Sehr geehrter ${params.voornaam},&nbsp;</p>


    <p>&nbsp;</p>


    <p>Am ${params.orderDate} haben Sie über unsere Website <a href="https://unsubby.com/" rel="noreferrer noopener" target="_blank">https://unsubby.com</a> ein Kündigungsschreiben erstellt und von uns an ${params.companyName} senden lassen. </p>


    <p>&nbsp;</p>


    <p> 

Mit Bedauern müssen wir feststellen, dass wir trotz mehrerer Zahlungserinnerungen noch immer keine Zahlung von Ihnen erhalten haben. Aufgrund dieser Verzögerung wurde die ursprüngliche Rechnung nun um 40 € für Inkassokosten erhöht. Damit beläuft sich der ausstehende Gesamtbetrag auf <strong> ${params.reminderAmount}</strong></p>


    <p>&nbsp;</p>


    <p>Wir möchten Sie dringend bitten, den vollen Betrag von<strong> ${params.reminderAmount} innerhalb von 7 Tagen </strong> nach Erhalt dieser E-Mail zu bezahlen. Sollten wir innerhalb dieser Frist keine Zahlung von Ihnen erhalten, sehen wir uns gezwungen, die Forderung an einen Gerichtsvollzieher zu übergeben. Bitte beachten Sie, dass <strong> die Kosten für die Inanspruchnahme eines Gerichtsvollziehers mehr als 750 € betragen können </strong> und vollständig zu Ihren Lasten gehen.</p>


    <p>&nbsp;</p>


    <p>Sie können auch direkt bezahlen, indem Sie auf die unten stehende Schaltfläche klicken. </p>


    <p>&nbsp;</p>


    <a href="${params.checkout}"><button style="background:#0090e3; padding: 10px 15px;color:white;outline:none; border:1px solid white;

    border-radius: 15px;cursor:pointer;font-size:16px;font-weight: bold;" type="button">Rechnung bezahlen | ${params.reminderAmount}</button></a>


    <p>&nbsp;</p>


    <p>Sollte die obige Schaltfläche nicht funktionieren, können Sie <a href="${params.checkout}"> diesen Link</a> verwenden. </p>


    <p>&nbsp;</p>


    <p>Mocht u vragen hebben over de mislukte automatische incasso of onze dienstverlening, dan staan wij voor u klaar om u verder te helpen.&nbsp;</p>


    <p>&nbsp;</p>


    <p>Wir hoffen, dass Sie das Problem bald in den Griff bekommen, und danken Ihnen im Voraus für Ihr Verständnis und Ihre Mitarbeit. </p>


    <p>&nbsp;</p>


    <p>Mit freundlichen Grüßen, </br>Das Unsubby Team </p>


    <p>&nbsp;</p>

    </div>

    <div style=" height: 93px;

    background: #182c55;

    align-items: center;

    padding: 0px 25px;

    max-width: 100%;

    margin:0px auto;" >

    <div class="logo" style="float:left; margin-top: 35px;">

      <img src="cid:uniqueu@kreata.ee"/>

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

    `;

return {htmlContent:htmlContent, subject : 'LETZTE MÖGLICHKEIT: Ihr Anspruch wird übertragen'};;
} 