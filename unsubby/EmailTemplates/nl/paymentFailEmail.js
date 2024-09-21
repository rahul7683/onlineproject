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
            <p><strong>BETALING MISLUKT: Betaal het openstaande bedrag zo spoedig mogelijk. &nbsp;</strong></p>
    
            <div class="table-card">
                <table>
                    <tbody>
                        <tr>
                            <th class="mr">Betaalstatus:</th>
                            <th style="color:#cc0000">Betaling mislukt</th>
                        </tr>
                        <tr>
                            <th class="mr">Bestelnummer:</th>
                            <td>${params.orderId}</td>
                        </tr>
                        <tr>
                            <th class="mr">Bedrag:</th>
                            <td>&euro; 29,95</td>
                        </tr>
                    </tbody>
                </table>
               
            </div>
    
            <p>&nbsp;</p>
    
    
            <p>Geachte ${params.voornaam +" "+params.achternaam},&nbsp;</p>
    
    
    
            <p>Op ${params.orderDate} heeft u gebruikgemaakt van onze online opzegservice op <a style="color:#0090e3;"
                    href="https://unsubby.com/${params.languageCode}-${params.countryCode}/" rel="noreferrer noopener" target="_blank">unsubby.com</a> en hebben wij voor
                u de opzegging bij ${params.companyName} verzorgd en de betreffende opzegbrief is inmiddels uitgeprint en verstuurd. Wij willen bevestigen dat uw opzegbrief correct is verzonden en doorgaans binnen 30 dagen door ${params.companyName} wordt verwerkt.</p>
    
    
            <p>Echter hebben wij vernomen dat de eenmalige domiciliëring die wij hebben geprobeerd uit te voeren, niet door uw bank is geaccepteerd. Dit kan om diverse redenen zijn gebeurd, zoals; u heeft een verkeerde IBAN ingevuld, u heeft onvoldoende saldo of de betaling is geweigerd door uw bank.</p>
    
    
            <p>Aangezien u een betaalverplichting heeft omdat de opzegservice reeds door ons is uitgevoerd en wij hierbij kosten hebben gemaakt, verzoeken wij u vriendelijk om het openstaande bedrag van <strong> &euro; 29,95 alsnog binnen 14 dagen </strong> na ontvangst van deze e-mail te voldoen. Wanneer u niet binnen 14 dagen betaald zijn wij genoodzaakt om <strong> &euro; 15,- administratiekosten </strong> in rekening te brengen.</p>
    
            <p>Voor uw gemak kunt u direct betalen door op de onderstaande knop te drukken.</p>


            <a style="color:#007bff;display: flex;justify-content: center;" href="${params.checkout}"><button style="background:#007bff;box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19); padding: 15px 40px;margin:10px 0px;color:white;outline:none; border:1px solid #007bff;
    
      border-radius: 25px;cursor: pointer; font-size:18px; font-weight: bold;" type="button">Rekening betalen | &euro;
                    29,95</button></a>
    
    
            <p>Mocht bovenstaande knop niet werken, dan kunt u <a style="color:#0090e3;" href="${params.checkout}"> deze
                    link</a> gebruiken.&nbsp;</p>
                    
    
            <p>Mocht u vragen hebben over de mislukte domiciliëring of onze dienstverlening, raadpleeg dan onze helpdesk pagina of contacteer onze klantenservice via <a style="color:#0090e3;"
                    href="mailto:${supportEmail}">${supportEmail}</a>. Wij staan altijd klaar om u verder te helpen.&nbsp;</p>

                    <p>We vertrouwen erop dat u deze kwestie spoedig afhandelt, en danken u alvast voor uw begrip en medewerking. </p>
    
            <p>Met vriendelijke groet,&nbsp;</p>
    
            <p>&nbsp;</p>
    
            <p>Het Unsubby Team&nbsp;</p>
    
    
            <p>&nbsp;</p>
    
            <small style="color:grey" ;>Dit is een geautomatiseerd noreply-bericht. Wij verzoeken u vriendelijk geen berichten te verzenden naar dit noreply-adres, aangezien er geen opvolging op reacties plaatsvindt. U kunt ons per e-mail bereiken op <a style="color:#0090e3;" href="mailto:${supportEmail}">${supportEmail}</a>.
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

    return { htmlContent : htmlContent , subject : `BETALING MISLUKT: Betaal het openstaande bedrag zo spoedig mogelijk.`};

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
            <p><strong>ADMINISTRATIEKOSTEN: Er wordt &euro; 15,- extra in rekening gebracht. &nbsp;</strong></p>
    
            <div class="table-card">
                <table>
                    <tbody>
                        <tr>
                            <th class="mr">Betaalstatus:</th>
                            <th style="color:#cc0000">Betaling mislukt</th>
                        </tr>
                        <tr>
                            <th class="mr">Bestelnummer:</th>
                            <td>${params.orderId}</td>
                        </tr>
                        <tr>
                            <th class="mr">Bedrag:</th>
                            <td>&euro; 44,95</td>
                        </tr>
                    </tbody>
                </table>
               
            </div>
    
            <p>&nbsp;</p>
    
    
            <p>Geachte ${params.voornaam +" "+params.achternaam},&nbsp;</p>
    
    
    
            <p>Op ${params.orderDate} heeft u via onze website <a style="color:#0090e3;"
                    href="https://unsubby.com/${params.languageCode}-${params.countryCode}/" rel="noreferrer noopener" target="_blank">unsubby.com</a> een opzegbrief gegenereerd en door ons laten verzenden naar ${params.companyName}.</p>
    
    
            <p>Ondanks een eerdere betaalherinnering hebben wij tot op heden geen betaling van u ontvangen. Daarom zijn we nu genoodzaakt om <strong> &euro; 15,- administratiekosten </strong> in rekening te brengen bovenop het oorspronkelijke bedrag van € 29,95. Het totale openstaande bedrag komt hierdoor op <strong> &euro; 44,95. </strong> Indien wij <strong> binnen 7 dagen </strong> geen betaling van u ontvangen, zullen we helaas het oorspronkelijke factuurbedrag met een <strong> additionele € 40,- incassokosten </strong> moeten verhogen.</p>
    
    
            <p>Voor uw gemak kunt u direct betalen door op de onderstaande knop te drukken.</p>


            <a style="color:#007bff;display: flex;justify-content: center;" href="${params.checkout}"><button style="background:#007bff;box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19); padding: 15px 40px;margin:10px 0px;color:white;outline:none; border:1px solid #007bff;
    
      border-radius: 25px;cursor: pointer; font-size:18px; font-weight: bold;" type="button">Rekening betalen | &euro;
                    44,95</button></a>
    
    
            <p>Mocht bovenstaande knop niet werken, dan kunt u <a style="color:#0090e3;" href="${params.checkout}"> deze
                    link</a> gebruiken.&nbsp;</p>
                    
    
            <p>Mocht u vragen hebben over de mislukte domiciliëring of onze dienstverlening, raadpleeg dan onze helpdesk pagina of contacteer onze klantenservice via <a style="color:#0090e3;"
                    href="mailto:${supportEmail}">${supportEmail}</a>. Wij staan altijd klaar om u verder te helpen.&nbsp;</p>

                    
                    <p>We vertrouwen erop dat u deze kwestie spoedig afhandelt, en danken u alvast voor uw begrip en medewerking. Als u de betaling al heeft verricht voordat u deze mail ontving, dan kunt u deze e-mail negeren.&nbsp;</p>
    
            <p>&nbsp;</p>
    
            <p>Het Unsubby Team&nbsp;</p>
    
    
            <p>&nbsp;</p>
    
            <small style="color:grey" ;>Dit is een geautomatiseerd noreply-bericht. Wij verzoeken u vriendelijk geen berichten te verzenden naar dit noreply-adres, aangezien er geen opvolging op reacties plaatsvindt. U kunt ons per e-mail bereiken op <a style="color:#0090e3;" href="mailto:${supportEmail}">${supportEmail}</a>.
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

    return { htmlContent : htmlContent , subject : `ADMINISTRATIEKOSTEN: Er wordt € 15,- extra in rekening gebracht.`};


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
            <p><strong>INCASSOKOSTEN: Er wordt &euro; 40,- extra in rekening gebracht.  &nbsp;</strong></p>
    
            <div class="table-card">
                <table>
                    <tbody>
                        <tr>
                            <th class="mr">Betaalstatus:</th>
                            <th style="color:#cc0000">Betaling mislukt</th>
                        </tr>
                        <tr>
                            <th class="mr">Bestelnummer:</th>
                            <td>${params.orderId}</td>
                        </tr>
                        <tr>
                            <th class="mr">Bedrag:</th>
                            <td>&euro; 69,95</td>
                        </tr>
                    </tbody>
                </table>
               
            </div>
    
            <p>&nbsp;</p>
    
    
            <p>Geachte ${params.voornaam +" "+params.achternaam},&nbsp;</p>
    
    
    
            <p>Op ${params.orderDate} heeft u via onze website <a style="color:#0090e3;"
                    href="https://unsubby.com/${params.languageCode}-${params.countryCode}/" rel="noreferrer noopener" target="_blank">unsubby.com</a> een opzegbrief gegenereerd en door ons laten verzenden naar ${params.companyName}.</p>
    
    
            <p>Tot onze spijt moeten we constateren dat, ondanks meerdere betalingsherinneringen, we nog steeds geen betaling van u hebben ontvangen. Vanwege deze vertraging is de oorspronkelijke factuur nu verhoogd met <strong> &euro; 40,- aan incassokosten.</strong> Het totale openstaande bedrag komt hierdoor op <strong>&euro; 69,95.</strong> </p>
    

            <p>We willen u dringend verzoeken om het volledige bedrag van <strong> &euro; 69,95 binnen 7 dagen </strong> na ontvangst van deze e-mail te voldoen. Als we geen betaling van u ontvangen binnen deze termijn, kunnen we de vordering uit handen geven aan een deurwaarder. Houd er rekening mee dat <strong> de kosten voor het inschakelen van een deurwaarder op kunnen lopen tot meer dan € 750,- </strong> en deze zullen volledig voor uw rekening komen. </p>
    
            <p>Voor uw gemak kunt u direct betalen door op de onderstaande knop te drukken.</p>


            <a style="color:#007bff;display: flex;justify-content: center;" href="${params.checkout}"><button style="background:#007bff;box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19); padding: 15px 40px;margin:10px 0px;color:white;outline:none; border:1px solid #007bff;
    
      border-radius: 25px;cursor: pointer; font-size:18px; font-weight: bold;" type="button">Rekening betalen | &euro;
                    69,95</button></a>
    
    
            <p>Mocht bovenstaande knop niet werken, dan kunt u <a style="color:#0090e3;" href="${params.checkout}"> deze
                    link</a> gebruiken.&nbsp;</p>
                    
    
            <p>Mocht u vragen hebben over de mislukte domiciliëring of onze dienstverlening, raadpleeg dan onze helpdesk pagina of contacteer onze klantenservice via <a style="color:#0090e3;"
                    href="mailto:${supportEmail}">${supportEmail}</a>. Wij staan altijd klaar om u verder te helpen.&nbsp;</p>

                    
                    <p>We vertrouwen erop dat u deze kwestie spoedig afhandelt, en danken u alvast voor uw begrip en medewerking. Als u de betaling al heeft verricht voordat u deze mail ontving, dan kunt u deze e-mail negeren.&nbsp;</p>
    
            <p>&nbsp;</p>
    
            <p>Het Unsubby Team&nbsp;</p>
    
    
            <p>&nbsp;</p>
    
            <small style="color:grey" ;>Dit is een geautomatiseerd noreply-bericht. Wij verzoeken u vriendelijk geen berichten te verzenden naar dit noreply-adres, aangezien er geen opvolging op reacties plaatsvindt. U kunt ons per e-mail bereiken op <a style="color:#0090e3;" href="mailto:${supportEmail}">${supportEmail}</a>.
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

    return { htmlContent : htmlContent , subject : `INCASSOKOSTEN: Er wordt € 40,- extra in rekening gebracht.`};

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
            <p><strong>LAATSTE KANS: Voorkom dat uw vordering wordt overgedragen. &nbsp;</strong></p>
    
            <div class="table-card">
                <table>
                    <tbody>
                        <tr>
                            <th class="mr">Betaalstatus:</th>
                            <th style="color:#cc0000">Betaling mislukt</th>
                        </tr>
                        <tr>
                            <th class="mr">Bestelnummer:</th>
                            <td>${params.orderId}</td>
                        </tr>
                        <tr>
                            <th class="mr">Bedrag:</th>
                            <td>&euro; 69,95</td>
                        </tr>
                    </tbody>
                </table>
               
            </div>
    
            <p>&nbsp;</p>
    
    
            <p>Geachte ${params.voornaam +" "+params.achternaam},&nbsp;</p>
    
    
    
            <p>Op ${params.orderDate} heeft u via onze website <a style="color:#0090e3;"
                    href="https://unsubby.com/${params.languageCode}-${params.countryCode}/" rel="noreferrer noopener" target="_blank">unsubby.com</a> een opzegbrief gegenereerd en door ons laten verzenden naar ${params.companyName}.</p>
    
    
            <p>Tot onze spijt moeten we constateren dat, ondanks meerdere betalingsherinneringen, we nog steeds geen betaling van u hebben ontvangen. U heeft nog een totaal openstaand bedrag van <strong> &euro; 69,95.</strong> </p>
    

            <p>We willen u dringend verzoeken om het volledige bedrag van <strong> &euro; 69,95 binnen 7 dagen </strong> na ontvangst van deze e-mail te voldoen. Als we geen betaling van u ontvangen binnen deze termijn, zijn we genoodzaakt om de vordering uit handen te geven aan een deurwaarder. Houd er rekening mee dat <strong> de kosten voor het inschakelen van een deurwaarder op kunnen lopen tot meer dan &euro; 750,- </strong> en deze zullen volledig voor uw rekening komen. </p>
  

            <a style="color:#007bff;display: flex;justify-content: center;" href="${params.checkout}"><button style="background:#007bff;box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19); padding: 15px 40px;margin:10px 0px;color:white;outline:none; border:1px solid #007bff;
    
      border-radius: 25px;cursor: pointer; font-size:18px; font-weight: bold;" type="button">Rekening betalen | &euro;
                    69,95</button></a>
    
    
            <p>Mocht bovenstaande knop niet werken, dan kunt u <a style="color:#0090e3;" href="${params.checkout}"> deze
                    link</a> gebruiken.&nbsp;</p>
                    

                    <p>We verzoeken u dringend om de betaling zo spoedig mogelijk te voldoen om verdere kosten en maatregelen te voorkomen. Als u de betaling al heeft verricht voordat u deze mail ontving, dan kunt u deze e-mail negeren. </p>

    
            <p>Mocht u vragen hebben over de mislukte domiciliëring of onze dienstverlening, raadpleeg dan onze helpdesk pagina of contacteer onze klantenservice via <a style="color:#0090e3;"
                    href="mailto:${supportEmail}">${supportEmail}</a>. Wij staan altijd klaar om u verder te helpen.&nbsp;</p>
    
            <p>&nbsp;</p>
    
            <p>Het Unsubby Team&nbsp;</p>
    
    
            <p>&nbsp;</p>
    
            <small style="color:grey" ;>Dit is een geautomatiseerd noreply-bericht. Wij verzoeken u vriendelijk geen berichten te verzenden naar dit noreply-adres, aangezien er geen opvolging op reacties plaatsvindt. U kunt ons per e-mail bereiken op <a style="color:#0090e3;" href="mailto:${supportEmail}">${supportEmail}</a>.
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

    return { htmlContent : htmlContent , subject : `LAATSTE KANS: Voorkom dat uw vordering wordt overgedragen.`};

}

export const paymentReminder5 = (params = {}) => {
    
    let supportEmail = SupportEmail[params.countryCode];

    let htmlContent = `<div style="padding: 10px 35px;"><p><strong>LAATSTE KANS: Uw vordering wordt overgedragen&nbsp;</strong></p>

 
    <p>&nbsp;</p>


    <p><strong>Betaalstatus&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; <span style="color:#e74c3c">&nbsp;</span><span style="color:#cc0000">Betaling mislukt</span></strong></p>


    <p><strong>Bestelnummer&nbsp; &nbsp; &nbsp; &nbsp; &nbsp;${params.orderId}</strong></p>


    <p><strong>Bedrag&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&euro; 69,95</strong></p>


    <p>&nbsp;</p>


    <p>Geachte ${params.voornaam +" "+params.achternaam},&nbsp;</p>


    <p>&nbsp;</p>


    <p>Op ${params.orderDate} heeft u via onze website <a href="https://unsubby.com/${params.languageCode}-${params.countryCode}/" rel="noreferrer noopener" target="_blank">https://unsubby.com</a> een opzegbrief gegenereerd en door ons laten versturen naar ${params.companyName}.&nbsp;</p>


    <p>&nbsp;</p>


    <p>Tot onze spijt moeten we constateren dat, ondanks meerdere betalingsherinneringen, we nog steeds geen betaling van u hebben ontvangen. Vanwege deze vertraging is de oorspronkelijke factuur nu verhoogd met &euro;40 aan incassokosten. Het totale openstaande bedrag komt hierdoor op<strong> &euro; 69,95</strong>.&nbsp;</p>


    <p>&nbsp;</p>


    <p>We willen u dringend verzoeken om het volledige bedrag van<strong> &euro; 69,95 binnen 7 dagen</strong> na ontvangst van deze e-mail te voldoen. Als we geen betaling van u ontvangen binnen deze termijn, zijn we genoodzaakt de vordering uit handen te geven aan een deurwaarder. Houd er rekening mee dat<strong> de kosten voor het inschakelen van een deurwaarder op kunnen lopen tot meer dan &euro; 750,- </strong>en deze zullen volledig voor uw rekening komen.&nbsp;</p>


    <p>&nbsp;</p>


    <p>Voor uw gemak kunt u direct betalen door op de onderstaande knop te drukken.&nbsp;</p>


    <p>&nbsp;</p>


    <a href="${params.checkout}"><button style="background:#0090e3; padding: 10px 15px;color:white;outline:none; border:1px solid white;

    border-radius: 15px;cursor:pointer;font-size:16px;font-weight: bold;" type="button">Rekening betalen | &euro; 69,95</button></a>


    <p>&nbsp;</p>


    <p>Mocht bovenstaande knop niet werken, dan kun je <a href="${params.checkout}"> deze link</a> gebruiken.&nbsp;</p>


    <p>&nbsp;</p>


    <p>Mocht u vragen hebben over de mislukte domiciliëring of onze dienstverlening, dan staan wij voor u klaar om u verder te helpen.&nbsp;</p>


    <p>&nbsp;</p>


    <p>We vertrouwen erop dat u deze kwestie spoedig afhandelt, en danken u alvast voor uw begrip en medewerking.&nbsp;</p>


    <p>&nbsp;</p>


    <p>Met vriendelijke groet,&nbsp;</p>


    <p>&nbsp;</p>


    <p>Het Unsubby Team&nbsp;</p>


    <p>&nbsp;</p>

    </div>

    <div style=" height: 93px;

    background: #182c55;

    align-items: center;

    padding: 0px 25px;

    max-width: 100%;

    margin:0px auto;" >

    <div class="logo" style="float:left; margin-top: 35px;">

      <img src="cid:unique@kreata.ee"/>

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

    return { htmlContent : htmlContent , subject : `LAATSTE KANS: Voorkom dat uw vordering wordt overgedragen.`};

}