import mongoose from "../../dbConfig.js"
import {
    Roles
} from '../../utils/constant.js';
const customerSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'First Name is required']
    },
    lastName: {
        type: String,
        default: ""
        // required: [true, 'Name is required']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'Email is required']
    },
    password: {
        type: String,
        required: [true, 'password is required']
    },
    countryId: {
        type: mongoose.Types.ObjectId,
        ref: "country"
    },
    countryCode: {
        type: String,
    },
    languageCode: {
        type: String,
    },
    contactNumber: {
        type: String,
    },
    address: {
        type: String,
    },
    postal: {
        type: String,
    },
    city: {
        type: String,
    },
    loginCode: {
        type: String
    },
    isActive: {
        type: Boolean,
        default: true
    },
    orders: [{
        order: {
            type: mongoose.Types.ObjectId,
            ref: "order"
        },
        orderDate: {
            type: Date
        },
    }],
    credit: {
        available: {
            type: Number
        },
        used: {
            type: Number
        }
    },
    paymentResponse: {
        type: Object
    },
    subscriptionResponse: {
        type: Object
    },
/*    mollieCustomerId : {
        type : String
    },*/
    mollie: {
        customerId: {
            type: String
        },
        nextPaymentDate:{
            type: String
        },
        paymentMethod : {
            method : String,
            nextPayment : Date,
            amount : String
        }
    },
    paymentLink : {
        id:String,
        url:String
    }, 
    emailBounced :{
        type:Boolean,
        default:false
    },
    chargedBackUpdatedAt: {
        type: Date
    },
    failedUpdatedAt: {
        type: Date
    },
    reminderCount : {
        type : Number,
        default : 0
    },
    lastLoggedInAt : {
        type : Date
    }
}, {
    timestamps: true
})

const Customer = mongoose.model('customer', customerSchema);
export default Customer;