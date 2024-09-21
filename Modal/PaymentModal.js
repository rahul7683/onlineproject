import { Schema } from 'mongoose';
import mongoose from "../dbConfig.js"
import {
    LetterStatus
} from '../utils/constant.js';

const companyLetter = new mongoose.Schema({
    company: {
        type:mongoose.Types.ObjectId,
        ref:"company"
    },
    companyName : String,
    companyAddress : String,
    letterId: String,
    downloadUrl: String,
    fields: Array,
    letterPrice: Number,
    letterStatus: {
        type: Number,
        default: 0, //created
        enum: Object.values(LetterStatus)
    },    
    letterPdf : String,
    retry: {
        type: Number
    },
});

const orderSchema = new mongoose.Schema({
    orderId:{
        type:String,
        required:true,
    },
    countryId : {
         type:mongoose.Types.ObjectId,
        ref:"country"
    },
    dbCustomerId : {
         type:mongoose.Types.ObjectId,
        ref:"customer"
    },    
    ipAddress:{
        type:String,
        // required:true,
    },
    customerId:{
        type:String,
    },
    paymentVendor:{
        type:String,
    },
    countryCode:{
        type:String,
    },
    languageCode:{
        type:String,
    },
    company: {
        type:mongoose.Types.ObjectId,
        ref:"company"
    },
    companies : [companyLetter],
    letterContent: {
        type:Object,
        required:true,
    },
    letterPdf: {
        type:String,
    },
    letterId:{
        type:String,
    },
    letterSent: {
        type:Boolean,
        default:false
    },
    letterStatus: {
        type: Number,
        default : 0, //created
        enum: Object.values(LetterStatus)
    },
    EmailSent: {
        type:Boolean,
        default:false
    },
    paymentResponse: {
        type:Object,
    },  
    date: {
        type:Date
    }, 
    momentDate:{
        type: Date
    },
    reminderCount: {
        type: Number,
        default: 0
    },
    chargedBackUpdatedAt: {
        type: Date
    },
    failedUpdatedAt: {
        type: Date
    },
    paymentLink : {
        id:String,
        url:String
    }, 
    emailBounced :{
        type:Boolean,
        default:false
    },
    deviceType:{
        type:String
    },
    doSubscription:{
        type: Number,
        default: 0, //created
        enum: Object.values(LetterStatus)
    },
    // 0 means order completed using reminder link
    completeOrderReminder : {
        type : Number
    }
})

const ordermodel = mongoose.model('order', orderSchema);
export default ordermodel;