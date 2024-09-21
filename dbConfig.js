import mongoose from 'mongoose'
import { MONGODB_URI, TEST_MONGODB_URI } from './config.js';
mongoose.Promise = global.Promise;
let connectMongoDbUri = MONGODB_URI;

if(process.env.ENV=="test"){
    connectMongoDbUri = TEST_MONGODB_URI;
}
const promise=mongoose.connect(connectMongoDbUri,{useNewUrlParser:true,useUnifiedTopology:true})
promise.then(function(db) {
    console.log("Connected to database!!!");
}, function(err){
    console.log("Error in connecting database " + err);
});

export default mongoose