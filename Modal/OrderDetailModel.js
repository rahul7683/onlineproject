import {
    Schema
} from 'mongoose';
import mongoose from "../dbConfig.js"
const orderDetailSchema = new mongoose.Schema({
    dbOrderId: {
        type: mongoose.Types.ObjectId,
        ref: "order"
    },
    orderId: {
        type: String,
    },
    customerSignature: {
        type: String
    }
}, {
    timestamps: true
})

//expire after 30 days
orderDetailSchema.index({createdAt: 1},{expireAfterSeconds: 2592000});

const orderDetailsmodel = mongoose.model('order-details', orderDetailSchema);
export default orderDetailsmodel;