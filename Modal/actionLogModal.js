
import mongoose from "../dbConfig.js"

// Define the schema for the action logs
const actionLogSchema = new mongoose.Schema({
  actionBy: { 
    type: String,
     required: true
     },
  actionName: { 
    type: String,
     required: true,
      
    },
  actionOn: { 
    type: String,
     required: true,
     
    },
  actionData: { 
    type: mongoose.Schema.Types.Mixed,
    required: true
 },
   
  ttl: {
     type: Date,
      expires:5184000,//in 60 day  document will be remove    5184000 second
      default: Date.now 
    } 
},

{
  timestamps: true
});

// Create and export the model
const Actionlog = mongoose.model('ActionLog', actionLogSchema);
//const blogmodel = mongoose.model('blog', blogSchema);
export default Actionlog;
