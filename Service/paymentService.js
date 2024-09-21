import paymentmodel from "../Modal/PaymentModal.js";
import moment from 'moment';
import {
    LetterStatus
} from '../utils/constant.js';
import OrderService from "./orderService.js";

export const addPayment = (req, res) => {
  let date= new Date(); 
  let options = {timeZone: 'Europe/Amsterdam', year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
  let eastCoastTime = (date.toLocaleString('en-US', options));
  let orderData = {
    ipAddress:req.ipAddress,
    orderId:req.orderId,
    customerId:req.customerId,
    countryCode : req.countryCode,
    languageCode : req.languageCode?req.languageCode:'nl',
    company:req.company,
    letterContent:req.letterContent,
    paymentResponse:req.paymentResponse,
    letterPdf:req.letterPdf,
    letterSent:req.letterSent,
    letterId:req.letterId,
    EmailSent:req.EmailSent,
    paymentVendor : req.paymentVendor?req.paymentVendor:'mollie',
    countryId : req.countryId?req.countryId:'653645399d3c03cfc9a160bb',
    date:new Date(),
    momentDate:moment()
  }

  if (req.deviceType) {
    orderData.deviceType = req.deviceType;
  }

  if (req.companies) {
    orderData.companies = req.companies
  }

  if (req.dbCustomerId) {
    orderData.dbCustomerId = req.dbCustomerId
  }

  if (req.doSubscription) {
    orderData.doSubscription = req.doSubscription
  }  
  
  //remove cookie order data
  OrderService.deleteCookieOrder({'letterContent.Emailadres':req.letterContent.Emailadres});

  let createPay=new paymentmodel(orderData)
  .save()
  return createPay
};

export const getPaymentByOrderId = (req) => {
  let responseArr= paymentmodel
    .find({orderId:req.orderId}).populate("company").lean()
    .exec()
    return responseArr  
};

export const getAllOrder = (req, res) => {
 return paymentmodel
    .find({},{letterPdf:0}).populate("company",{companyName:1}).sort({_id:-1}).limit(5).lean()
    .exec()
    
};

export const getAllOrderList = (req, res) => {
 return  paymentmodel
    .find({},{letterPdf:0,EmailSent:0}).populate("company",{companyName:1}).sort({_id:-1}).lean()
    .exec()
};

export const updateOrder= (condition, updateField) => {
 return paymentmodel.updateOne(condition,{$set:updateField}).exec()
}

export const updateOrderMany= (condition, updateField) => {
 return paymentmodel.updateMany(condition,{$set:updateField}).exec()
}


export const getOrder = (condition, select={}) => {
    return paymentmodel
        .findOne(condition,select).populate("company", {
            companyName: 1
        });
};


export const getFilteredOrder = (condition, fields=null) => {
    let selected = {
        letterPdf: 0
    };

    if(fields){
        selected = fields; 
    }

    return paymentmodel
        .find(condition,selected).populate("company", {
            companyName: 1
        }).lean();
};

export const getFilteredOrderCount = (condition) => {
    return paymentmodel
        .count(condition);
};


export const getOrderOfMultipleLetter = async(letterId,letterStatus=LetterStatus.Created) => {
    let elemMatch={
        letterStatus: letterStatus,
        letterId: letterId
    }
    let findCondition = {
        companies: {
            $elemMatch:elemMatch
        },
        emailBounced: {
            $ne: true
        }

    }
    const letterData = await getOrder(findCondition, {
        company: 1,
        orderId: 1,
        letterContent: 1,
        languageCode: 1,
        countryCode: 1,
        'companies.$': 1
    });
    if (!letterData) {
        return null;
    }
    let emailParams = letterData.letterContent;
    const letterObject = letterData.companies[0];
    emailParams.companyName = letterObject.companyName;
    emailParams.companyAddress = letterObject.companyAddress;
    emailParams.downloadUrl = letterObject.downloadUrl;
    emailParams.countryCode = letterData.countryCode;
    emailParams.languageCode = letterData.languageCode;
    emailParams.orderId = letterData.orderId;
    updateOrder(findCondition, {
        'companies.$.letterStatus': LetterStatus.Sent
    });
    return emailParams;
};

export const runAggregate = (condition) => {
    return paymentmodel
        .aggregate(condition);
};
