import axios from 'axios';
import {APIKey,URL} from "../config.js"

export const getAllMailbox=(req,res)=>{
    var config = {
      method: 'get',
      url: URL,
      headers: { 
        'X-Authorization': APIKey,
        "Accept": "application/json, text/plain, */*",
      }
    };
    axios(config)
    .then(function (response) {
       return res.json({
            data:response.data
        })
    })
    .catch(function (error) {
        return res.json({
            error:error
        })
    });   
}