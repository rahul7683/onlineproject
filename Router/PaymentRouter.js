import express from 'express'
import multer from 'multer'
const router = express.Router()
import {checkCompanySubmit, checkIfSixOrder} from "../middleware/checkCompanySubmit.js"
import {createPayment,getPayment,getAllOrders} from "../Controller/PaymentController.js"
import {getAllOrder,getAllOrderList} from "../Service/paymentService.js"

import {validate} from '../middleware/validator.js';

const storage = multer.diskStorage({
    destination: './upload/category',
    filename: (req, file, cb) => {
        return cb(null, file.fieldname + Date.now() + file.originalname)
    }
})

const upload = multer({ 
    storage: storage
})

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
          message:"De server is te druk. Probeer het a.u.b. nogmaals na 1 minuut."
        }),
})

router.get('/',getAllOrder);
router.get('/All',getAllOrders);
router.get('/order/:orderId',getPayment);
router.post('/',upload.none(),validate('orderSchema'),checkCompanySubmit,checkIfSixOrder,limiter, createPayment);
// router.get('/email',PaymentconfirmationEmail);

export default router;