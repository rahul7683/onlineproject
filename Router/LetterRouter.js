import express from 'express'
const router = express.Router()
import {getLetters,getLetterByLetterId, createLetter,cancelLetter, verifyReCaptchToken, verifyReCaptchTokenV2} from "../Controller/LetterController.js"

router.get('/:mailBoxId',getLetters);
router.get('/:mailBoxId/letter/:letterId',getLetterByLetterId);
router.post('/:mailBoxId/letter',createLetter);
router.get('/:mailBoxId/letter/:letterId/cancel',cancelLetter);
router.post('/verifyReCaptchToken',verifyReCaptchToken);
router.post('/verifyReCaptchToken2',verifyReCaptchTokenV2);


export default router; 