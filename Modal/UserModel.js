import mongoose from "../dbConfig.js"
import {
    Roles
} from '../utils/constant.js';
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'First Name is required']
    },
    lastName: {
        type: String,
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
    contactNumber: {
        type: String,
    },
    company: {
        type: mongoose.Types.ObjectId,
        ref: "company"
    },
    roles: {
        type: String,
        enum: Object.values(Roles)
    },
    loginCode: {
        type: String
    },
    isActive: {
        type: Boolean,
        default: true
    }    

}, {
    timestamps: true
})

const User = mongoose.model('user', userSchema);
export default User;