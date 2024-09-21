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
    route : String
});

const orderSchema = new mongoose.Schema({
    countryId : {
         type:mongoose.Types.ObjectId,
        ref:"country"
    },  
    ipAddress:{
        type:String,
        // required:true,
    },    
    countryCode:{
        type:String,
    },
    languageCode:{
        type:String,
    },
    companies : [companyLetter],
    letterContent: {
        type:Object,
        required:true,
    },    
    letterStatus: {
        type: Number,
        default : 0, //created
        enum: Object.values(LetterStatus)
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
},{
    timestamps: true
})

const cookieOrdermodel = mongoose.model('cookie-order', orderSchema);
export default cookieOrdermodel;