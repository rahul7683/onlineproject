import mongoose from 'mongoose';
const contentPageSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required']
    },
    type: {
        type: String,
        required: [true, 'Type is required']
    },
    countryId: {
        type: mongoose.Types.ObjectId,
        required: [true, 'country is required'],
        ref: "country"
    },
    countryCode:{
        type:String,
        required: [true, 'countryCode is required'],
    }, 
    content: {
        type: String
    },
    subject:{
        type:String,
    },
    countryCode:{
        type:String,
    },
    languageCode:{
        type:String,
    },
    sections: {
        type: Array
    }
}, {
    timestamps: true
})

const ContentPage = mongoose.model('contentPage', contentPageSchema);
export default ContentPage;