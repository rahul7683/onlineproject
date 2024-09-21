import express from 'express'
const router = express.Router()
import {getAllMailbox} from "../Controller/MailboxController.js"

router.get('/',getAllMailbox);

export default router; 