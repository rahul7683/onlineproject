import { Schema } from 'mongoose';
import mongoose from "../dbConfig.js"
const orderStatisticSchema = new mongoose.Schema({
    domain:{
        type:String,
    },
    lastOrderId:{
        type:String,
    },
    grandTotal : {
        type :Number
    },
    lastTweleveMonth : {
        type:Object
    },
    lastThreeYear : {
        type:Object
    }
},{
    timestamps: true
})

const orderStatisticsmodel = mongoose.model('order-statistics', orderStatisticSchema);
export default orderStatisticsmodel;