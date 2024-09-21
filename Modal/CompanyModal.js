import {
    Schema
} from 'mongoose';
import mongoose from "../dbConfig.js"
const companySchema = new mongoose.Schema({
    category: {
        type: mongoose.Types.ObjectId,
        required: [true, 'Name is required'],
        ref: "category"
    },
    countryCode: {
        type: String
    },
    countryId: {
        type: mongoose.Types.ObjectId,
        ref: "country"
    },
    companyName: {
        type: String,
        required: true,
    },
    Address: {
        type: String,
        required: true
    },
    addressLine: {
        type: String
    },
    postcode: {
        type: String
    },
    city: {
        type: String
    },
    country: {
        type: String
    },
    Fields: {
        type: Array,
        required: true
    },
    Content: {
        type: Array
    },
    route: {
        type: String
    },
    Title: {
        type: String
    },
    Meta: {
        type: String
    },
    sideLinks: {
        type: Array
    },
    postpaidMethodAmount: {
        type: Number
    },
    prepaidMethodAmount: {
        type: Number
    },
    currency: {
        type: String,
        default: 'EUR'
    },
    paymentMethods: {
        type: Array,
        default: []
    },
    orderCount: {
        type: Number,
        default: 0
    },
    orderSum: {
        type: Number,
        default: 0
    },
    isActive: {
        type: Boolean,
        default: 0
    },
    date: {
        type: Date
    }
}, {
    timestamps: true
})

const companymodel = mongoose.model('company', companySchema);
export default companymodel;