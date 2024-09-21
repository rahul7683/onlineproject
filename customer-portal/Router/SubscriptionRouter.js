import express from 'express'
const router = express.Router()
import SubscriptionController from '../Controller/SubscriptionController.js';
import SubscriptionMiddleware from '../Middleware/subscription.middleware.js'
import JWTMiddleware from '../Middleware/auth.middleware.js';
import {validate} from '../Middleware/validator.js';

/**
 * @swagger
 * components:
 *   schemas:
 *     Subscription:
 *       type: object
 *       required:
 *         - paymentMethod
 *         - iban
 *         - cardToken
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the book
 *         paymentMethod:
 *           type: string
 *           description: The paymentMethod 
 *         iban:
 *           type: string
 *           description: The iban account number
 *         cardToken:
 *           type: string
 *           description: the cardToken 
 *       example:
 *         id: d5fE_asz
 *         paymentMethod: creditcard
 *         iban: 8888NL898989899
 *         cardToken: kjhskhksah
 *         createdAt: 2020-03-10T04:05:06.157Z
 */

/**
 * @swagger
 * tags:
 *   name: SubscriptionDetail
 *   description: The Subscriptions managing API
 * /subscription/{id}:
 *   get:
 *     summary: Get a Subscription detail
 *     tags: [Subscriptions]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           example: 5f60b26b692cf083f81e3bde
 *         required: true
 *         description: Id of Subscription to get detail
 *     responses:
 *       200:
 *         description: The delete Subscription.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Subscription'
 *       500:
 *         description: Some server error
 *     security: [ApiKeyAuth: [], jwt_token: []]
 */
router.get('/:id', JWTMiddleware.validateJWTToken, SubscriptionController.getOne);

/**
 * @swagger
 * tags:
 *   name: List
 *   description: The Subscriptions managing API
 * /subscription:
 *   get:
 *     summary: list Subscription
 *     tags: [Subscriptions] 
 *     responses:
 *       200:
 *         description: The login Subscription.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Subscription'
 *       500:
 *         description: Some server error
 *     security: [ApiKeyAuth: [], jwt_token: []]
 */
router.get('/', JWTMiddleware.validateJWTToken, SubscriptionController.list);


/**
 * @swagger
 * tags:
 *   name: Create
 *   description: The Subscriptions managing API
 * /subscription:
 *   post:
 *     summary: Create Subscription
 *     tags: [Subscriptions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Subscription'
 *     responses:
 *       200:
 *         description: The login Subscription.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Subscription'
 *       500:
 *         description: Some server error
 *     security: [ApiKeyAuth: [], jwt_token: []]
 */
router.post('/',JWTMiddleware.validateJWTToken,validate('subscriptionSchema'), SubscriptionMiddleware.validateBodyRequest, SubscriptionController.create);


/**
 * @swagger
 * tags:
 *   name: Change
 *   description: The Subscriptions managing API
 * /subscription/change-payment-method:
 *   post:
 *     summary: Create Subscription
 *     tags: [Subscriptions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Subscription'
 *     responses:
 *       200:
 *         description: The login Subscription.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Subscription'
 *       500:
 *         description: Some server error
 *     security: [ApiKeyAuth: [], jwt_token: []]
 */
router.post('/checkout-session', SubscriptionMiddleware.validateBodyRequest, SubscriptionController.stripeCheckoutSession);

/**
 * @swagger
 * tags:
 *   name: Create
 *   description: The Subscriptions managing API
 * /subscription/direct:
 *   post:
 *     summary: Create Subscription
 *     tags: [Subscriptions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Subscription'
 *     responses:
 *       200:
 *         description: The login Subscription.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Subscription'
 *       500:
 *         description: Some server error
 *     security: [ApiKeyAuth: [], jwt_token: []]
 */
router.post('/direct',SubscriptionController.createDirect);


/**
 * @swagger
 * tags:
 *   name: Change
 *   description: The Subscriptions managing API
 * /subscription/change-payment-method:
 *   post:
 *     summary: Create Subscription
 *     tags: [Subscriptions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Subscription'
 *     responses:
 *       200:
 *         description: The login Subscription.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Subscription'
 *       500:
 *         description: Some server error
 *     security: [ApiKeyAuth: [], jwt_token: []]
 */
router.post('/change-payment-method',JWTMiddleware.validateJWTToken,validate('subscriptionSchema'), SubscriptionMiddleware.validateBodyRequest, SubscriptionController.changePaymentMethod);


/**
 * @swagger
 * tags:
 *   name: Change
 *   description: The Subscriptions managing API
 * /subscription/reactivate-payment-method:
 *   post:
 *     summary: reactivate Subscription
 *     tags: [Subscriptions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Subscription'
 *     responses:
 *       200:
 *         description: The login Subscription.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Subscription'
 *       500:
 *         description: Some server error
 *     security: [ApiKeyAuth: [], jwt_token: []]
 */
router.post('/reactivate-payment-method',JWTMiddleware.validateJWTToken, SubscriptionMiddleware.validateBodyRequest, SubscriptionController.reactivateSubscription);

/**
 * @swagger
 * tags:
 *   name: Update
 *   description: The Subscriptions managing API
 * /subscription:
 *   patch:
 *     summary: Update Subscription
 *     tags: [Subscriptions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Subscription'
 *     responses:
 *       200:
 *         description: The update Subscription.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Subscription'
 *       500:
 *         description: Some server error
 *     security: [ApiKeyAuth: [], jwt_token: []]
 */
router.patch('/', JWTMiddleware.validateJWTToken, SubscriptionMiddleware.validateUpdateRequest, SubscriptionController.update);
/**
 * @swagger
 * tags:
 *   name: Delete
 *   description: The Subscriptions managing API
 * /subscription/{id}:
 *   delete:
 *     summary: Delete Subscription
 *     tags: [Subscriptions]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           example: 5f60b26b692cf083f81e3bde
 *         required: true
 *         description: Id of Subscription to delete
 *     responses:
 *       200:
 *         description: The delete Subscription.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Subscription'
 *       500:
 *         description: Some server error
 *     security: [ApiKeyAuth: [], jwt_token: []]
 */
router.delete('/:id', SubscriptionController.deleteOne);

export default router;