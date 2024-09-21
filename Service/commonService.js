import {
    sendEmail
} from "./emailService.js";
import CountryService from "./countyService.js"
import {
    updateOneCompanyDyno
} from './companyService.js';
import axios from 'axios';
import useragent from 'express-useragent';
import moment from 'moment';
import {
    TO_EMAILS,
    G_RECAPTCHA_SECRET,
    G_RECAPTCHA_SECRET_V2,
    G_ADDRESS_VALIDATOR, 
    ENV
} from '../config.js';

import {
    CountryData
} from '../utils/constant.js'
import {    
    getFilteredOrderCount
} from "./paymentService.js";

import {
    sendEmailUnsubby
} from "./emailService.js";

export const sendErrorNotification = async(subject, error, body=null) => {
    if (ENV != 'local') {
        sendEmail({
            to: TO_EMAILS,
            subject: subject,
            body: body ? body : `<h3>${error.message}</h3><br><p>${error.stack}</p>`
        });
    }
}

export const verifyReCaptchToken = async(req, type, captchaToken, apiCount=1) => {
    // Validate the reCAPTCHA token on the server-side

    try {
        let gSecret = G_RECAPTCHA_SECRET;
        if(type=='v2'){
            gSecret = G_RECAPTCHA_SECRET_V2;
        }

        const response = await axios.post(
            `https://www.google.com/recaptcha/api/siteverify?secret=${gSecret}&response=${captchaToken}`
        );
        if (response.data.success) {
            console.log('scoreeeeeeeeeee######',response.data)
            //reCaptcha verification successfull
            let isMobileAllow = false ;

             const ua = useragent.parse(req.headers['user-agent']);
             const isMobile = ua.isMobile

            console.log('Is mobileeeeeeeeeeeeeeeeee', isMobile);
            //return response.data;

            if(isMobile && response.data.score >= 0.1){
                isMobileAllow = true;
            }

            if(response.data.hostname =='unsubby.com'){
                return response.data;
            };

            //Enable desktop orders for abbostop
            if(!isMobile && await checkOrderEnableStatus(req)){
                return response.data;
            }

            //Disable desktop orders for abbostop
            if(!isMobile){
                return false;
            }

            //Score check of 0.3 and user tried more than once, desktop orders for abbostop
            if(!isMobileAllow && apiCount>1 && response.data.score >= 0.3){
                 return response.data;
            }

            //Score check of 0.7 desktop orders for abbostop
            if(response.data.score <= 0.7 && !isMobileAllow ){
                return false;
            }
            return response.data;
        } else {
            // reCAPTCHA verification failed
            return false;
        }
    } catch (error) {
        console.error(error);
        return false;
    }
}

export const addressValidator = async(regionCode,address) => {
    try {
        const response = await axios.post(`https://addressvalidation.googleapis.com/v1:validateAddress?key=${G_ADDRESS_VALIDATOR}`,{
            "address": {
              "regionCode":regionCode,
              "addressLines": [address]
              
            }
          });
        if (response.data.result) {
            return response.data.result;
        } 
    } catch (error) {
        console.error(error);
        return false;
    }
}

function checkDesktopOrderTime() {
    const hour = moment().hour();
    console.log('hourrrrrrrr', hour);
    const day = moment().day();
    let isEnable = false;

    if ((hour >= 9 && hour < 19) && (day > 0 && day < 6)) {
        isEnable = true;
    }
    return isEnable;
}

async function checkOrderEnableStatus(req) {
    let condition={_id:req.body.countryId || "653645399d3c03cfc9a160bb"}
    let select={setting:1,countryCode:1}
    let isEnable = true;
    let country=await CountryService.findOne(condition,select)
    if(country?.setting){
        isEnable=country.setting.desktopOrderStatus
    }else{
        isEnable=true
    }
    return isEnable;
}


export const formateAmountForCountry = (countryCode, amount, currency = '&euro;') => {
    try {
        const formatedAmount = parseFloat(amount).toLocaleString(CountryData[countryCode].locale.replace('_', '-'));
        currency = CountryData[countryCode].currency;

        let returnValue = '';
        switch (countryCode) {
            case 'at':
            case 'nl':
            case 'us':
                returnValue = currency + ' ' + formatedAmount;
                break;
            // case 'us':
            //     returnValue = formatedAmount + ' ' + currency;
            //     break;
            default:
                returnValue = formatedAmount + ' ' + currency;
        }
        //let returnValue = countryCode == 'at' || countryCode == 'nl' ?  : 
        return returnValue;
    } catch (error) {
        console.error(error);
        return null;
    }
}

export const formateCompanyNames = (companies, countryCode) => {
    try {

        let andWord = 'und';
        if (countryCode == 'fr') {
            andWord = 'et';
        }else if(countryCode == 'nl'){
            andWord = 'en';
        }else if(countryCode == 'us'){
            andWord = 'and';
        }

        let companiesName = companies.map(item => {
            return item.companyName;
        })

        if (companiesName.length == 1) {
            return companiesName[0];
        }
        const lastCompany = companiesName.splice(companiesName.length - 1, 1);
        companiesName = companiesName.join(', ');
        return `${companiesName} ${andWord} ${lastCompany}`;

    } catch (error) {
        console.error(error);
        return null;
    }
}


export const getSubscriptiUniqeId = async (payment) => {

    let description = payment.description.split(' ');
    return description[description.length - 1];
}
// errorObject - {isError:true, error:error}
export const formateIfErrorResponse = (errorObject, countryCode) => {

    if (errorObject.isError) {
        let errorResponse = {
            success: false,
            message: "Failed",
            error: errorObject.error,
        }
        if (errorObject.error.message) {
            errorResponse = {
                success: false,
                message: 'Invalid payment detail given.',
                error: errorObject.error.message,
            }
        }
        return errorResponse;
    }

    return null;
}


export const checkOrderRate = async(params) => {
    const thirtyMinBefore = moment().subtract(30, 'minute');
    const countOrder = await getFilteredOrderCount({
        paymentVendor: params.paymentVendor, //we can de also
        countryId: params.countryId,
        momentDate: {
            $gte: thirtyMinBefore,
            $lte: moment()
        }
    });
    console.log('Order count on 30 minnnnnnnn=>', countOrder);
    if (countOrder >= 80) {
        sendEmailUnsubby({
            to: TO_EMAILS,
            subject: 'Unsubby PPM Alert [' + params.countryCode + '] ! 80 order created within a 30 mins ',
            body: `<h1>Unsubby PPM Alert [${params.countryCode}] ! 80 order created within a 30 mins <h1>`
        });
    }
}

export const updateCompanyOrderCount = async(params) => {

    let companyIds = [];
    if (params.companies) {
        companyIds = params.companies.map(item => {
            return item.company
        });
    } else {
        companyIds = [params.company];
    }
    updateOneCompanyDyno({
        _id: {
            $in: companyIds
        }
    }, {
        $inc: {
            orderCount: 1
        }
    });

}

export const addDelay = async(time) => {
  return new Promise(resolve => setTimeout(resolve, time));
} 



