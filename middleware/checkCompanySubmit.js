import ordermodel from "../Modal/PaymentModal.js";
import moment from 'moment';
import {
     CountryData
} from '../utils/constant.js';
export const checkCompanySubmit=async (req, res, next) => {
    const ipAddress = req.header('x-forwarded-for') || req.header('X-Real-IP') || req.body.ipAddress;
    let findCondition = { ipAddress: ipAddress , company :  req?.body?.company };
    if(req.body.paymentMethods && req.body.paymentMethods!=''){
        findCondition = {};
        findCondition['paymentResponse.status'] = 'paid';
        findCondition['paymentResponse.method'] = req.body.paymentMethods;
        findCondition['letterContent.Emailadres'] = req.body.formData.Emailadres;
        findCondition['companies.company'] = req.body.companies[0].company;
    }

    // if(req.body.companies && req.body.companies.length > 1){
    //     return next();
    // }

     let orderip= await ordermodel.find( findCondition,{company:1,date:1,ipAddress:1}).sort({_id:-1}).populate("company",{companyName:1}).exec()
          if (orderip.length > 0){
            console.log("inside length-----------")
            for await (const item of orderip ) {
              if(item?.company?.companyName === req?.body?.companyName){
                    console.log("inside company-----------")
                    var dateOffset = (60*1000);
                    let oldDate=item?.date
                    let newDate=new Date()  
                    let timeLeft=(newDate-oldDate);
                    let timeLeftinMIn=Math.round((60*60*1000/dateOffset)-(timeLeft/dateOffset))
                    if(timeLeftinMIn > 0){ 
                      console.log("inside time left-----------")
                      let messageTimeLeft = `U kunt na ${timeLeftinMIn} minuten weer een brief sturen`;
                      if(req.body.countryCode){
                          let countryCodeOnly  = req.body.countryCode.split('-')[1];
                          messageTimeLeft = CountryData[countryCodeOnly].timeLeftToResubmit.replace('#timeLeftinMIn',timeLeftinMIn);
                      }
                      return res.json({
                    success: false,
                    type:"timeleft",
                    message:messageTimeLeft,
                    // message: `You Can Send Letter after ${timeLeftinMIn} Minutes `,
                  });
                }
                }
            }
          }
          // res.json({
          //   status:false,
          //   message:'success',
          // })
          next();
}


export const checkIfSixOrder = async(req, res, next) => {

    const address = req.body?.formData.Adres || req.body?.formData.address || req.body ?.formData.adres;
    let orderCount = await ordermodel.count({
        'letterContent.adres': address,
        'letterContent.postcode': req.body?.formData.postcode,
        'letterContent.woonplaats': req.body?.formData.woonplaats,
        date: {
            $gte: moment().startOf('day')
        }
    }).exec()
    if (orderCount >= 6) {
        return res.json({
            success: false,
            type: "timeleft",
            message: `Je hebt je limiet voor vandaag bereikt. Probeer morgen nogmaals het opzegformulier in te dienen.`,
            // message: `You Can Send Letter after ${timeLeftinMIn} Minutes `,
        });
    }
    next();
}


export const checkCompanySubmitLatest = async(req, res, next) => {
    const ipAddress = req.header('x-forwarded-for') || req.header('X-Real-IP') || req.body.ipAddress;
    let findCondition = {
        ipAddress: ipAddress,
        'companies.company': req.body.companies[0].company,
        'paymentResponse.status':'succeeded'
    };
    if (req.body.formData && req.body.formData.Emailadres) {
        delete findCondition.ipAddress;
        findCondition['letterContent.Emailadres'] = req.body.formData.Emailadres;
    }

    let item = await ordermodel.find(findCondition, {
        companies: 1,
        date: 1,
        ipAddress: 1
    }).sort({_id:-1}).limit(1).exec();

    if (item && item.length>0) {
        console.log("inside length-----------")
        console.log("inside company-----------")
        var dateOffset = (60 * 1000);
        let oldDate = item[0] ?.date
        let newDate = new Date()
        let timeLeft = (newDate - oldDate);
        let timeLeftinMIn = Math.round((60 * 60 * 1000 / dateOffset) - (timeLeft / dateOffset))
        if (timeLeftinMIn > 0) {
            console.log("inside time left-----------")
            let messageTimeLeft = `U kunt na ${timeLeftinMIn} minuten weer een brief sturen`;
            if (req.body.countryCode) {
                let countryCodeOnly = req.body.countryCode.split('-')[1];
                messageTimeLeft = CountryData[countryCodeOnly].timeLeftToResubmit.replace('#timeLeftinMIn', timeLeftinMIn);
            }
            return res.json({
                success: false,
                type: "timeleft",
                message: messageTimeLeft,
                // message: `You Can Send Letter after ${timeLeftinMIn} Minutes `,
            });
        }

    }

    next();
}