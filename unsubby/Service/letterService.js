import PingenLetter from './pingenLetter.js';
import MySendingBoxLetter from './mysendingboxLetter.js';
import PostGridLetter from './postgridLetter.js';
import crypto from 'crypto';
import {
    uploadinS3Promise
} from "../../Service/s3FileUploadService.js"
import fs from 'fs/promises';
import {
    SupportEmail,
    CountryData,
    LetterStatus
} from '../../utils/constant.js';

import {
    LETTER_DOWNLOAD_URL
} from '../../config.js';
import {
    sendErrorNotification
} from '../../Service/commonService.js';
//Abbostop letter 
import {
    createLetter
} from "../../Controller/LetterController.js";

export default class UnsubbyLetterService {
    static async sendLetters(params) {
        if (params.companies && params.companies.length > 0) {
            let domainName = "Unsubby";
            try {
                for (const [index, letter] of params.companies.entries()) {


                    let filename = letter.companyName.replaceAll(' ', '-') + "-" + params.orderId;
                    let domain = params.countryCode == 'nl' ? '' : 'unsubby/' + params.countryCode + '/';

                    if(!params.companies[index].downloadUrl){
                        await uploadinS3Promise(`pdf/${domain}${filename}.pdf`, letter.letterPdf, null);                    
                        const downloadUrl = `${LETTER_DOWNLOAD_URL}${domain}${filename}.pdf`;
                        params.companies[index].downloadUrl = downloadUrl;
                    }

                    if(params.companies[index].retry){
                        params.companies[index].retry = 0;
                    }                   


                    if (params.languageCode == 'fr') {
                        try {
                            const letterResponse = await MySendingBoxLetter.sendLetter(letter.companyName, params.companies[index].downloadUrl, params.orderId);
                            params.companies[index].letterId = letterResponse.data._id;
                            params.companies[index].letterPdf = '';
                        } catch (lettererror) {
                            params.companies[index].retry = params.companies[index].retry || params.companies[index].retry === 0 ? 0 : 1;
                            console.error('Error in send letters' + params.orderId, lettererror);
                            sendErrorNotification(domainName + ' : Error in letter create [' + params.countryCode.toUpperCase() + '] ' + params.orderId, lettererror);
                        }

                    } else if (params.countryCode == 'nl') {
                        domainName = 'Abbo stop'
                        try {
                            const letterResponse = await createLetter(params.orderId, letter.letterPdf, letter.companyName);
                            params.companies[index].letterId = letterResponse ?.data ?.id;
                            params.companies[index].letterPdf = '';
                        } catch (lettererror) {
                            params.companies[index].retry = params.companies[index].retry || params.companies[index].retry === 0 ? 0 : 1;
                            console.error('Error in send letters' + params.orderId, lettererror);
                            sendErrorNotification(domainName + ' : Error in letter create [' + params.countryCode.toUpperCase() + '] ' + params.orderId, lettererror);
                        }

                    } else if (params.languageCode == 'en' && ( params.countryCode == 'us'|| params.countryCode == 'uk')) {
                        params.letterContent.downloadUrl = params.companies[index].downloadUrl;
                        const letterResponse = await PostGridLetter.sendLetter(letter.companyName, letter.companyAddress, params.letterContent, params.orderId);
                        if (letterResponse.letter && letterResponse.letter.id) {
                            params.companies[index].letterId = letterResponse.letter.id;
                            params.companies[index].letterPdf = '';
                        } else {
                            //error
                            params.companies[index].retry = params.companies[index].retry || params.companies[index].retry === 0 ? 0 : 1;
                            console.error('Error in send letters' + params.orderId, JSON.stringify(letterResponse));
                            let errorEmailBody = `<h3>${letterResponse?.error?.message}</h3>
                            <p>Company name : ${params.companies[index].companyName}</p>
                            <p>Company address : ${params.companies[index].companyAddress}</p>
                            <p>Letter download URL : ${params.companies[index].downloadUrl}</p><br>
                            <p>Error log : ${letterResponse?.error?.type} <br> ${letterResponse?.error?.message}</p>`;        
                            sendErrorNotification(domainName + ' : Error in letter create [' + params.countryCode.toUpperCase() + '] ' + params.orderId, letterResponse, errorEmailBody);
                        }


                    } else {

                        await fs.writeFile(`${params.orderId}.pdf`, letter.letterPdf, {
                            encoding: 'base64'
                        })
                        try {
                            const file1 = await fs.readFile(`${params.orderId}.pdf`);
                            const blob1 = Buffer.from(file1);

                            const letterResponse = await PingenLetter.sendLetter(letter.companyName, blob1, params.orderId);

                            params.companies[index].letterId = letterResponse.data.data.id;
                            params.companies[index].letterPdf = '';

                            console.log('File created');
                            fs.unlink(`${params.orderId}.pdf`, function(err) {
                                console.log('deleted')
                            });

                        } catch (error) {
                            params.companies[index].retry = params.companies[index].retry || params.companies[index].retry === 0 ? 0 : 1;
                            console.error('Error in Pingin letter create', error);
                            sendErrorNotification('Unsubby : Error in Pingin letter create ' + params.orderId, error);

                        }

                    }    
                }
                return params;
            } catch (error) {
                console.error('Error in send letters' + params.orderId, error);
                sendErrorNotification(domainName + ' : Error in letter create [' + params.countryCode.toUpperCase() + '] ' + params.orderId, error);
                return params;
            }
        } else {
            console.log("No letters found in params");
            return params;
        }
    }
}