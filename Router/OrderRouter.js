import express from 'express'
const router = express.Router()
import OrderController from '../Controller/OrderController.js';
import userMiddleware from '../middleware/user.middleware.js'
import JWTMiddleware from '../middleware/auth.middleware.js'

/**
 * @swagger
 * components:
 *   schemas:
 *     Order:
 *       type: object
 *       required:
 *         - date
 *         - countryCode
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the order
 *         orderId:
 *           type: string  
 *           description: The id of the order
 *         countryCode:
 *           type: string
 *           description: The domain of the order
 *         emailBounced:
 *           type: boolean
 *           description: The Activity of the order
 *         reminderCount:
 *           type: number
 *           description: The no of times reminder sent
 *         paymentResponse:
 *           type: object
 *           description: The payment object from mollie
 *         date:
 *           type: string
 *           format: date
 *           description: The order was added
 *       example:
 *         orderId: ORD-1583-608991-3404
 *         countryId: 653645399d3c03cfc9a160bb
 *         company: 64a297b65adc00554d37f101
 *         emailBounced: false
 *         dateFrom: 2020-03-10T04:05:06.157Z
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     OrderStatistics:
 *       type: object
 *       required:
 *         - domain
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the order
 *         domain:
 *           type: string  
 *           description: Abbostop or Unsubby
 *         lastOrderId:
 *           type: string
 *           description: The id last order
 *         grandTotal:
 *           type: number
 *           description: The grand total of bussiness orders
 *         lastThreeYear:
 *           type: object
 *           description: The payment of orders year wise
 *         lastTweleveMonth:
 *           type: object
 *           description: The payment of orders month wise
 *       example:
 *         lastOrderId: ORD-1583-608991-3404
 *         domain: Unsubby
 *         grandTotal: 544454
 *         updatedAt: 2020-03-10T04:05:06.157Z
 */


/**
 * @swagger
 * tags:
 *   name: OrderStatistics
 *   description: The Order managing API
 * /order/statistics:
 *   get:
 *     summary: Get a order statistics
 *     tags: [Order]
 *     parameters:
 *     responses:
 *       200:
 *         description: The order statistics.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrderStatistics'
 *       500:
 *         description: Some server error
 *     security: [ApiKeyAuth: [], jwt_token: []]
 */
router.get('/statistics',OrderController.getStatistics);

/**
 * @swagger
 * tags:
 *   name: OrderDeatils
 *   description: The Order managing API
 * /order/{id}:
 *   get:
 *     summary: Get a order page
 *     tags: [Order]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           example: 5f60b26b692cf083f81e3bde
 *         required: true
 *         description: Id of orderpage to get detail
 *     responses:
 *       200:
 *         description: The delete ContentPage.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       500:
 *         description: Some server error
 *     security: [ApiKeyAuth: [], jwt_token: []]
 */
router.get('/:id',OrderController.getOne);
/**
 * @swagger
 * tags:
 *   name: List
 *   description: The ord page managing API
 * /order/list:
 *   post:
 *     summary: list Order
 *     tags: [Order] 
 *     responses:
 *       200:
 *         description: The order page.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       500:
 *         description: Some server error
 *     security: [ApiKeyAuth: [], jwt_token: []]
 */
router.post('/list',OrderController.list);

/**
 * @swagger
 * tags:
 *   name: List
 *   description: The ord page managing API
 * /order/list-customer-order:
 *   post:
 *     summary: list Order
 *     tags: [Order] 
 *     responses:
 *       200:
 *         description: The order page.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       500:
 *         description: Some server error
 *     security: [ApiKeyAuth: [], jwt_token: []]
 */
router.post('/list-customer-order',OrderController.panelCustomerList);

/**
 * @swagger
 * tags:
 *   name: List
 *   description: The order page managing API
 * /order:
 *   post:
 *     summary: list Order
 *     tags: [Order] 
 *     responses:
 *       200:
 *         description: The order page.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       500:
 *         description: Some server error
 *     security: [ApiKeyAuth: [], jwt_token: []]
 */
router.post('/',OrderController.create);

/**
 * @swagger
 * tags:
 *   name: stop reminder
 *   description: The stop reminder API
 * /order/stop-reminder:
 *   post:
 *     summary: stop email reminder
 *     tags: [Order]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Order' 
 *     responses:
 *       200:
 *         description: The order page.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       500:
 *         description: Some server error
 *     security: [ApiKeyAuth: [], jwt_token: []]
 */
router.post('/stop-reminder',OrderController.stopReminder);

/**
 * @swagger
 * tags:
 *   name: List
 *   description: The order page managing API
 * /order/cookie:
 *   post:
 *     summary: list Order
 *     tags: [Order] 
 *     responses:
 *       200:
 *         description: The order page.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       500:
 *         description: Some server error
 *     security: [ApiKeyAuth: [], jwt_token: []]
 */
router.post('/cookie',OrderController.createCookieOrder);

export default router; 