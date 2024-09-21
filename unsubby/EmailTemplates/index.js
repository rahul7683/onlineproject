import ContentPageService from "../../Service/contentPageService.js"
import Twig from "twig";
import he from 'he';
import {
    SupportEmail
} from '../../utils/constant.js';

import { sendEmailUnsubby } from "../../Service/emailService.js";
export default class EmailTemplate {
	languageCode = 'nl';
	constructor(languageCode){
		this.languageCode = languageCode
	}    
	static async getPaymentConfirmationEmail(languageCode, params) {
	  console.log("getPaymentConfirmationEmail", languageCode, params);
      params.languageCode = languageCode;
      const { paymentConfirmationEmail } = await import('./'+languageCode + "/paymentEmails.js");
	  let data = paymentConfirmationEmail(params); 
	  return data;
	}
    
	static async getLetterSentEmail(languageCode, params) {
        console.log("getLetterSentEmail", languageCode, params)
        params.languageCode = languageCode;
        const { letterSentEmail } = await import('./'+languageCode + "/paymentEmails.js");
        let data = letterSentEmail(params); 
        return data;
        console.log("data", data);
      }


    static async getEmailFromDB(languageCode, params, replaceObj=null) {
        console.log("getEmailFromDB", languageCode, params);
        params.languageCode = languageCode;
        let searchparams = {
            countryCode: params.countryCode,
            languageCode: languageCode,
            type: params.type,
            name: params.name
        }
        let data = await ContentPageService.findOne(searchparams);
        let htmlContent = await getTwigContent(data.content, params, replaceObj)
        if (params.to) {
            sendEmailUnsubby({
                to: params.to,
                subject: data.subject.replaceAll('{{companyName}}', params.companyName),
                body: htmlContent,
                replyTo: SupportEmail[params.countryCode]
            });
            return null;
        } else {
            return {
                htmlContent: htmlContent,
                subject: data.subject.replaceAll('{{companyName}}', params.companyName)
            };
        }
    }

    static async getChargeBackPaymentEmails(languageCode, params) {
        console.log("getChargeBackPaymentEmails", languageCode, params)
        params.languageCode = languageCode;
        const {
            reminder1,
            reminder2,
              reminder3,
            reminder4,
            reminder5
        } = await
        import ('./' + languageCode + "/chargebackEmail.js");
        let data = '';
        switch (params.type) {
            case 'reminder1':
                data = reminder1(params);
                break;
            case 'reminder2':
                data = reminder2(params);
                break;
            case 'reminder3':
                data = reminder3(params);
                break;
            case 'reminder4':
                data = reminder4(params);
                break;
            case 'reminder5':
            	data = reminder5(params);
            	break;
        }
        return data;
    }

    static async getFailedPaymentEmails(languageCode, params) {
        console.log("getFailedPaymentEmails", languageCode, params)
        params.languageCode = languageCode;
        const {
            paymentReminder1,
            paymentReminder2,
            paymentReminder3,
            paymentReminder4,
            paymentReminder5
        } = await
        import ('./' + languageCode + "/paymentFailEmail.js");
        let data = '';
        switch (params.type) {
            case 'paymentReminder1':
                data = paymentReminder1(params);
                break;
            case 'paymentReminder2':
                data = paymentReminder2(params);
                break;
            case 'paymentReminder3':
                data = paymentReminder3(params);
                break;
            case 'paymentReminder4':
                data = paymentReminder4(params);
                break;
            case 'paymentReminder5':
                data = paymentReminder5(params);
                break;
        }
        return data;
    }

}

const getTwigContent = async(content, params, replaceObj = null) => {

    console.log(params)
        // Compile the template

    if (params.companies) {
        let htmlContent = ``;
        params.companies.map((company, index) => {
            if (params.companies.length > 1 && index > 0) {
                htmlContent += `,`;
            }

            htmlContent += ` <a href="${company.downloadUrl}">${company.companyName}</a>`
                //return htmlContent;
        });

        content = content.replaceAll('{{downloadLinks}}', htmlContent);
    }

    if (params.companyAddress) {

        let htmlContent = ``;
        params.companyAddress.split(",")
            .map((address, index) => {
                return (
                    htmlContent += `<p className="address-linehight">
                         ${address}
                         </p>`
                );
            });

        content = content.replaceAll('{{companyAddress}}', htmlContent);

    }
    


    const template = Twig.twig({
        data: content
    });

    if (!replaceObj) {
        replaceObj = {
            voornaam: params.voornaam,
            achternaam: params.achternaam,
            companyName: params.companyName,
            companyAddress: params.companyAddress,
            languageCode: params.languageCode,
            countryCode: params.countryCode,
            supportEmail: params.supportEmail,
            reason: params.reason,
            address: params.adres,
            amount: params.amount,
            paymentMethod: params.paymentMethod,
            downloadUrl: params.downloadUrl,
            email:params.Emailadres,
            orderId:params.orderId
        }
    }

    // Render the template with the letterContent
    const renderedTemplate = template.render(replaceObj);

    const encodedString = renderedTemplate;
    const decodedString = he.decode(encodedString);

    return decodedString
}