
import express from 'express';
const router = express.Router();
import multer from 'multer';
import swaggerJSDoc from 'swagger-jsdoc';
import { validate } from '../middleware/validator.js';



import ActionLogController from '../Controller/actionLogController.js';; 

/**
 * @swagger
 * /:
 *   post:
 *     summary: Create a new action log
 *     tags: [ActionLog]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ActionLog'
 *     responses:
 *       200:
 *         description: Action log successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ActionLog'
 *       400:
 *         description: Invalid input, object invalid
 *       500:
 *         description: Internal server error
 */

router.post('/',validate('createActionLogSchema'), ActionLogController.createActionLog);

 
/**
 * @swagger
 * /:
 *   get:
 *     summary: Retrieve a list of action logs
 *     tags: [ActionLog]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: The page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: The number of action logs per page for pagination
 *     responses:
 *       200:
 *         description: A list of action logs
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 result:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ActionLog'
 *       400:
 *         description: Invalid query parameters
 *       500:
 *         description: Internal server error
 */
router.get('/', validate('listActionLogsSchema'), ActionLogController.listActionLogs);

export default router