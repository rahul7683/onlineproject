import mongoose from "../dbConfig.js"

const countrySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required']
    },
    domain:{
        type:String
    }, 
    logo:{
        type:String
    }, 
    countryCode:{
        type:String
    }, 
    languageCode:{
        type:String
    }, 
     allFields:{
        type:Array
    }, 
    defaultFields:{
        type:Array
    }, 
    mostCanceledSubscriptions:{
        type:Array
    }, 
    popularCategories:{
        type:Array
    },        
    setting:{
        desktopOrderStatus:{type:Boolean,default:true}
    },        
    isActive: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
})

const Country = mongoose.model('country', countrySchema);
export default Country;