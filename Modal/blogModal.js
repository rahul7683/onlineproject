import mongoose from "../dbConfig.js"
const blogSchema = new mongoose.Schema({
    image: {
        type: String,
        required: [true, 'This is required']
    },
    head: {
        type: String,
        required: [true, 'This is required']
    },
    subHead: {
        type: String,
        required: [true, 'This is required']
    },
    content: {
        type: String,
    },
    altText:{
        type: String,
    },
    countryCode: {
        type: String,
    },
    languageCode: {
        type: String,
    },
    metaTitle: {
        type: String,
    },
    metaKeyword: {
        type: String,
    },
    metaDescription: {
        type: String,
    },
    showInHomePage: {
        default: false,
        type: Boolean
    },
    slug: {
        type: String,
        required: [true, 'This is required']
    },
    date: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
})

const blogmodel = mongoose.model('blog', blogSchema);
export default blogmodel;

