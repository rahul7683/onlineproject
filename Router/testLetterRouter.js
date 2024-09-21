import express from 'express'
import multer from 'multer'
const router = express.Router()
import { sendLetterApi } from '../Controller/PingenletterApiController.js'
const storage = multer.diskStorage({
    destination: './upload/category',
    filename: (req, file, cb) => {
        return cb(null, file.fieldname + Date.now() + file.originalname)
    }
})

const upload = multer({ 
    storage: storage
})
router.post('/',upload.none(),sendLetterApi);

export default router;