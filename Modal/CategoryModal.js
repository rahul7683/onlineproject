import { Schema } from 'mongoose';
import mongoose from "../dbConfig.js"
const categorySchema = new mongoose.Schema({
    categoryName: {
        type: String,
        required: [true, 'Name is required']
    },
    countryId: {
        type: mongoose.Types.ObjectId,
        ref: "country"
    },
    languageCode:{
        type: String,
    },     
    Title: {
        type: String,
        // required: [true, 'Name is required']
    },
    Meta: {
        type: String,
        // required: [true, 'Name is required']
    },
    categoryLogo: {
        type: String,
        required:true
    },
    categoryContent: {
        type: Array,
    },
    letterIntro:{
        type: Array,
        // required:true
    } ,
    landingPageIntro:{
        type: Array,
    } ,
    route:{
        type: String,
    } ,
    isActive : {
        type : Boolean, 
        default : true
    },
    date: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
})

const categorymodel = mongoose.model('category', categorySchema);
export default categorymodel;