import express from 'express'
import multer from 'multer'
const router = express.Router()
import {checkCompanySubmit, checkIfSixOrder, checkCompanySubmitLatest} from "../../middleware/checkCompanySubmit.js"
import UnSubbyPayment from "../Controller/PaymentController.js"
import UnSubbyPaymentMethod from "../Controller/PaymentMethodController.js"
import StripePaymentMethod from "../Controller/StripePaymentController.js"
import {validate} from '../../middleware/validator.js';
import JWTMiddleware from '../../customer-portal/Middleware/auth.middleware.js';

import { rateLimit } from 'express-rate-limit'

const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    limit: 4, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
    standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers.    
    // store: ... , // Use an external store for consistency across multiple server instances.
    keyGenerator: (req, res) => req.header('x-forwarded-for') || req.headers['x-forwarded-for'] || req.header('X-Real-IP') || req.headers['x-real-ip'],
    handler: (req, res, next, options) => res.status(200).send({
          status:false,
          type:"test",
          message:"Der Server ist zu sehr beschäftigt. Bitte versuchen Sie es nach 1 Minute erneut."
        }),
})

const storage = multer.diskStorage({
    destination: './upload/category',
    filename: (req, file, cb) => {
        return cb(null, file.fieldname + Date.now() + file.originalname)
    }
})

const upload = multer({ 
    storage: storage
})

router.post('/',upload.none(),validate('orderSchemaUnsubby'), checkCompanySubmitLatest, checkIfSixOrder, limiter, StripePaymentMethod.createPayment);

router.post('/confirm', upload.none(), limiter, StripePaymentMethod.confirmPaymentIntent);

router.post('/mollie',upload.none(),validate('orderSchemaUnsubby'), checkIfSixOrder, checkCompanySubmit,limiter, UnSubbyPayment.createPaymentMollie);
router.post('/payment-method',upload.none(),validate('orderSchemaUnsubby'), checkIfSixOrder, checkCompanySubmit, limiter, UnSubbyPaymentMethod.create);
router.post('/cancel',upload.none(), UnSubbyPayment.cancelPayment);
router.post('/subscription-method',JWTMiddleware.validateJWTToken,upload.none(),validate('orderSchemaUnsubby'), limiter, UnSubbyPaymentMethod.subscriptionOrderCreate);
router.post('/sendToMissedEmail', upload.none(), limiter, StripePaymentMethod.sendToMissedEmail);


//Mollie APIs
router.get('/mollie/methods/all',upload.none(), UnSubbyPaymentMethod.getMollieMethodAll);
router.get('/mollie/methods/:name/:include',upload.none(), UnSubbyPaymentMethod.getMollieMethodDetail);





export default router;