import basicAuth from 'basic-auth';
import {ABBOSTOP_API_KEY,ABBOSTOP_ADMIN_PWD,ABBOSTOP_ADMIN_USERNAME} from "../config.js"
const validApiKeys=[ABBOSTOP_API_KEY]

const validCredentials = {
    username:ABBOSTOP_ADMIN_USERNAME,
    password: ABBOSTOP_ADMIN_PWD,
  };

export const validateApiKey = (req, res, next) => {

    const user = basicAuth(req);

    const apiKey = req.get('X-API-Key');
    const referer = req.headers.referer || req.headers.referrer;
    // console.log(referer)
    console.log(req.url)
    // if(req.url == "/api/webhooks/mollie" || req.url == "https://api.abbostop.nl/api/webhooks/mollie"){
    //   console.log("webhook func route")
    //   console.log(req.url)
    //  next()
    // }else
     if(!referer && !apiKey){
        console.log("inside1 ---")
        if (!user || user.name !== validCredentials.username || user.pass !== validCredentials.password) {
        res.set('WWW-Authenticate', 'Basic realm="Authorization required"');
        return res.status(401).json({ error: 'Unauthorized cred' });
      }
    }else if (!apiKey || !validApiKeys.includes(apiKey)) {
      console.log("inside2 ---")
          return res.status(401).json({ error: 'Unauthorized key' });
        }
    next();
  };