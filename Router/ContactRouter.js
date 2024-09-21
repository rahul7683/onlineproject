import express from 'express'
import multer from "multer"
const router = express.Router()
import {sendContactFrom, sendContactFromUnsubby} from "../Controller/ContactController.js"
import {
    validate
} from '../middleware/validator.js';
import { rateLimit } from 'express-rate-limit'
const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    limit: 1, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
    standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers.    
    // store: ... , // Use an external store for consistency across multiple server instances.
    keyGenerator: (req, res) => req.header('x-forwarded-for') || req.headers['x-forwarded-for'] || req.header('X-Real-IP') || req.headers['x-real-ip'],
    handler: (req, res, next, options) => res.status(200).send({
          status:false,
          type:"test",
          message:"Server seems busy please try again."
        }),
})

const storage = multer.diskStorage({
    destination: "./upload/category",
    filename: (req, file, cb) => {
      return cb(null, file.fieldname + Date.now() + file.originalname);
    },
  });
  
  const upload = multer({
    storage: storage,
  });

router.post('/email',limiter,upload.none(),validate('contactSchema'), sendContactFrom);
router.post('/uemail',limiter,upload.none(),validate('contactSchema'), sendContactFromUnsubby);


export default router; 