import { Schema } from 'mongoose';
import mongoose from "../dbConfig.js"
const LetterSchema = new mongoose.Schema({
    category: {
        type: mongoose.Types.ObjectId,
        required: [true, 'Name is required'],
        ref:"category"
    },
    companyName: {
        type: String,
        required:true,
    },
    Address:{
        type: String,
        required:true
    },
    Content:{
        type: String
    },
    date: {
        type: Date
    }
})

const lettermodel = mongoose.model('Letter', LetterSchema);
export default lettermodel;