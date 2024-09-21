import { Schema } from 'mongoose';
import mongoose from "../dbConfig.js"
const searchSchema = new mongoose.Schema({
    // category: {
    //     type: mongoose.Types.ObjectId,
    //     required:true,
    //     // ref:"category"
    // },
    companyId: {
        type:mongoose.Types.ObjectId,
        required:true,
    },
    companyName: {
        type: String,
        required:true,
    },
    address:{
        type: String,
        // required:true
    },  
    // title:{
    //     type: String
    // },  
    // meta:{
    //     type: String
    // },  
    // content:{
    //     type: Array
    // },
    // fields:{
    //     type: Array
    // },
    route:{
        type:String
    },
    date: {
        type: Date
    }
},
{
    capped:{size:765409,max:4}
})

const searchmodel = mongoose.model('search', searchSchema);
export default searchmodel;