import express from 'express'
const router = express.Router()
import ContentPageController from '../Controller/ContentPageController.js';
import userMiddleware from '../middleware/user.middleware.js'
import JWTMiddleware from '../middleware/auth.middleware.js'
import ContentPageMiddleware from '../middleware/contentpage.middleware.js'
import multer from 'multer'

/**
 * @swagger
 * components:
 *   schemas:
 *     ContentPage:
 *       type: object
 *       required:
 *         - name
 *         - type
 *         - country
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the page
 *         name:
 *           type: string
 *           description: The name of the page
 *         type:
 *           type: string
 *           description: The type of the page
 *         country:
 *           type: string
 *           description: The country of the page
 *         content:
 *           type: string
 *           description: The content of the page
 *         sections:
 *           type: array
 *           description: sections of the page 
 *         createdAt:
 *           type: string
 *           format: date
 *           description: The page the content was added
 *       example:
 *         id: d5fE_asz
 *         name: Home page
 *         type: Home
 *         country: NL
 *         content: <HTml><h1>Home page</h1></HTMl>
 *         sections: []
 *         createdAt: 2020-03-10T04:05:06.157Z
 */

/**
 * @swagger
 * tags:
 *   name: ContentPageDeatils
 *   description: The ContentPage managing API
 * /contentpage/{id}:
 *   get:
 *     summary: Get a content page
 *     tags: [ContentPage]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           example: 5f60b26b692cf083f81e3bde
 *         required: true
 *         description: Id of contentpage to get detail
 *     responses:
 *       200:
 *         description: The delete ContentPage.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ContentPage'
 *       500:
 *         description: Some server error
 *     security: [ApiKeyAuth: [], jwt_token: []]
 */
router.get('/:id',ContentPageController.getOne);
/**
 * @swagger
 * tags:
 *   name: List
 *   description: The content page managing API
 * /contentpage:
 *   get:
 *     summary: list ContentPage
 *     tags: [ContentPage] 
 *     parameters:
 *       - in: query
 *         name: countryId
 *         schema:
 *           type: string
 *           example: 5f60b26b692cf083f81e3bde
 *         required: true
 *         description: Id of country to get detail
 *     responses:
 *       200:
 *         description: The content page.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ContentPage'
 *       500:
 *         description: Some server error
 *     security: [ApiKeyAuth: [], jwt_token: []]
 */
router.get('/',ContentPageController.list);
/**
 * @swagger
 * tags:
 *   name: Create
 *   description: The content page managing API
 * /contentpage:
 *   post:
 *     summary: Create ContentPage
 *     tags: [ContentPage]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ContentPage'
 *     responses:
 *       200:
 *         description: The login user.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ContentPage'
 *       500:
 *         description: Some server error
 *     security: [ApiKeyAuth: [], jwt_token: []]
 */
router.post('/',ContentPageMiddleware.validateBodyRequest,ContentPageController.create);
/**
 * @swagger
 * tags:
 *   name: Update
 *   description: The contentpage managing API
 * /contentpage:
 *   put:
 *     summary: Update contentpage
 *     tags: [ContentPage]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ContentPage'
 *     responses:
 *       200:
 *         description: The update contentpage.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       500:
 *         description: Some server error
 *     security: [ApiKeyAuth: [], jwt_token: []]
 */
router.put('/', JWTMiddleware.validateJWTToken, ContentPageMiddleware.validateUpdateRequest,ContentPageController.update);

/**
 * @swagger
 * tags:
 *   name: Delete
 *   description: The contentpage managing API
 * /contentpage/{id}:
 *   delete:
 *     summary: Delete contentpage
 *     tags: [ContentPage]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           example: 5f60b26b692cf083f81e3bde
 *         required: true
 *         description: Id of contentpage to delete
 *     responses:
 *       200:
 *         description: The delete contentpage.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ContentPage'
 *       500:
 *         description: Some server error
 *     security: [ApiKeyAuth: [], jwt_token: []]
 */
router.delete('/:id',JWTMiddleware.validateJWTToken,ContentPageController.deleteOne);

router.post('/upload',multer().single('image'),ContentPageMiddleware.validateUploadRequest, ContentPageController.uploadStuff);


export default router; 