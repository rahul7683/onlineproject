import express from 'express'
const router = express.Router()
import CountryController from '../Controller/CountryController.js';
import userMiddleware from '../middleware/user.middleware.js'
import JWTMiddleware from '../middleware/auth.middleware.js'
import CountryMiddleware from '../middleware/country.middleware.js'

/**
 * @swagger
 * components:
 *   schemas:
 *     Country:
 *       type: object
 *       required:
 *         - name
 *         - domain
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the country
 *         name:
 *           type: string  
 *           description: The name of the country
 *         domain:
 *           type: string
 *           description: The domain of the country
 *         isActive:
 *           type: boolean
 *           description: The Activity of the country
 *         createdAt:
 *           type: string
 *           format: date
 *           description: The country was added
 *       example:
 *         id: 64a28da85adc00554d37f0ed
 *         name: Neatherlands
 *         domain: abbostop.nl
 *         isActive: true
 *         createdAt: 2020-03-10T04:05:06.157Z
 */


/**
 * @swagger
 * tags:
 *   name: CountryDeatils
 *   description: The Country managing API
 * /country/{id}:
 *   get:
 *     summary: Get a content page
 *     tags: [Country]
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
 *               $ref: '#/components/schemas/Country'
 *       500:
 *         description: Some server error
 *     security: [ApiKeyAuth: [], jwt_token: []]
 */
router.get('/:id',CountryController.getOne);
/**
 * @swagger
 * tags:
 *   name: List
 *   description: The content page managing API
 * /country:
 *   get:
 *     summary: list Country
 *     tags: [Country] 
 *     responses:
 *       200:
 *         description: The content page.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Country'
 *       500:
 *         description: Some server error
 *     security: [ApiKeyAuth: [], jwt_token: []]
 */
router.get('/',CountryController.list);
/**
 * @swagger
 * tags:
 *   name: Create
 *   description: The content page managing API
 * /country:
 *   post:
 *     summary: Create Country
 *     tags: [Country]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Country'
 *     responses:
 *       200:
 *         description: The create country.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Country'
 *       500:
 *         description: Some server error
 *     security: [ApiKeyAuth: [], jwt_token: []]
 */
router.post('/',JWTMiddleware.validateJWTToken,CountryMiddleware.validateBodyRequest,CountryMiddleware.validateUnique,CountryController.create);
/**
 * @swagger
 * tags:
 *   name: Update
 *   description: The Country managing API
 * /country:
 *   put:
 *     summary: Update Country
 *     tags: [Country]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Country'
 *     responses:
 *       200:
 *         description: The update Country.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Country'
 *       500:
 *         description: Some server error
 *     security: [ApiKeyAuth: [], jwt_token: []]
 */
router.put('/', JWTMiddleware.validateJWTToken,CountryMiddleware.validateUpdateRequest,CountryController.update);


/**
 * @swagger
 * tags:
 *   name: Update
 *   description: The Country Setting managing API
 * /country:
 *   put:
 *     summary: Update Country Setting
 *     tags: [Country]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Country'
 *     responses:
 *       200:
 *         description: The update Country setting.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Country'
 *       500:
 *         description: Some server error
 *     security: [ApiKeyAuth: [], jwt_token: []]
 */
router.put('/setting', JWTMiddleware.validateJWTToken,CountryMiddleware.validateUpdateRequest,CountryController.OrderSetting);

/**
 * @swagger
 * tags:
 *   name: Delete
 *   description: The country managing API
 * /country/{id}:
 *   delete:
 *     summary: Delete Country
 *     tags: [Country]
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
 *               $ref: '#/components/schemas/Country'
 *       500:
 *         description: Some server error
 *     security: [ApiKeyAuth: [], jwt_token: []]
 */
router.delete('/:id',JWTMiddleware.validateJWTToken,CountryController.deleteOne);

export default router; 