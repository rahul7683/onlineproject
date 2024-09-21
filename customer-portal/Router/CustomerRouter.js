import express from 'express'
const router = express.Router()
import CustomerController from '../Controller/CustomerController.js';
import CustomerMiddleware from '../Middleware/customer.middleware.js'
import JWTMiddleware from '../Middleware/auth.middleware.js';
import {validate} from '../Middleware/validator.js';

import { rateLimit } from 'express-rate-limit'

const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    limit: 1, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
    standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers.    
    // store: ... , // Use an external store for consistency across multiple server instances.
    keyGenerator: (req, res) => req.header('x-forwarded-for') || req.headers['x-forwarded-for'] || req.header('X-Real-IP') || req.headers['x-real-ip'],
    handler: (req, res, next, options) => res.status(200).send({
          status:false,
          type:"test",
          message:"Success l."
        }),
})

// {
//     "firstName": "MD",
//      "lastName":"Amaan",
//     "email": "amaan@test.com",
//     "password": "123",
//     "roles": "Admin",
//     "company": "649ae10997545f6902d67c6d",
//   "contactNumber": "7004937515" 
//   }


/**
 * @swagger
 * components:
 *   schemas:
 *     Customer:
 *       type: object
 *       required:
 *         - firstName
 *         - email
 *         - password
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the book
 *         firstName:
 *           type: string
 *           description: The firstName of your book
 *         lastName:
 *           type: string
 *           description: The lastName of your book
 *         countryId:
 *           type: string
 *           description: the id of country
 *         email:
 *           type: string
 *           description: The customer email
 *         address:
 *           type: string
 *           description: The customer email
 *         postal:
 *           type: string
 *           description: The customer email
 *         city:
 *           type: string
 *           description: The customer email
 *         password:
 *           type: boolean
 *           description: Whether you have password reading the book
 *         createdAt:
 *           type: string
 *           format: date
 *           description: The date the book was added
 *       example:
 *         id: d5fE_asz
 *         firstName: The New Turing Omnibus
 *         email: Alexander K. Dewdney
 *         password: false
 *         createdAt: 2020-03-10T04:05:06.157Z
 * 
 *     Login:
 *       type: object
 *       required: 
 *         - email
 *         - password
 *       properties: 
 *         email:
 *           type: string
 *           description: The book email
 *         password:
 *           type: string
 *           description: Whether you have password reading the book
 *       example:
 *         email: test@test.com
 *         password: 123456
 * 
 */

/**
 * @swagger
 * tags:
 *   name: Login
 *   description: The customers managing API
 * /customer/login:
 *   post:
 *     summary: Login customer
 *     tags: [customers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Login'
 *     responses:
 *       200:
 *         description: The login customer.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Login'
 *       500:
 *         description: Some server error
 *     security: [ApiKeyAuth: []]
 */
router.post('/login', CustomerController.login);
/**
 * @swagger
 * tags:
 *   name: Logout
 *   description: The customers managing API
 * /customer/Logout:
 *   post:
 *     summary: Logout customer
 *     tags: [customers] 
 *     responses:
 *       200:
 *         description: The logout customer.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Login'
 *       500:
 *         description: Some server error
 *     security: [ApiKeyAuth: [], jwt_token: []]
 */
router.post('/logout', CustomerController.logout);
/**
 * @swagger
 * tags:
 *   name: CustomerDetail
 *   description: The customers managing API
 * /customer/{id}:
 *   get:
 *     summary: Get a customer detail
 *     tags: [customers]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           example: 5f60b26b692cf083f81e3bde
 *         required: true
 *         description: Id of customer to get detail
 *     responses:
 *       200:
 *         description: The delete customer.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Customer'
 *       500:
 *         description: Some server error
 *     security: [ApiKeyAuth: [], jwt_token: []]
 */
router.get('/:id', JWTMiddleware.validateJWTToken, CustomerController.getOne);

/**
 * @swagger
 * tags:
 *   name: CustomerDetail
 *   description: The customers managing API
 * /customer/code/{id}:
 *   get:
 *     summary: Get a customer detail
 *     tags: [customers]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           example: 5f60b26b692cf083f81e3bde
 *         required: true
 *         description: Id of customer to get detail
 *     responses:
 *       200:
 *         description: The delete customer.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Customer'
 *       500:
 *         description: Some server error
 *     security: [ApiKeyAuth: [], jwt_token: []]
 */
router.get('/code/:id', CustomerController.getOneOpen);
/**
 * @swagger
 * tags:
 *   name: List
 *   description: The customers managing API
 * /customer/list:
 *   post:
 *     summary: list customer
 *     tags: [customers] 
 *     responses:
 *       200:
 *         description: The login customer.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Customer'
 *       500:
 *         description: Some server error
 *     security: [ApiKeyAuth: [], jwt_token: []]
 */
router.post('/list', JWTMiddleware.validateJWTToken, CustomerController.list);
/**
 * @swagger
 * tags:
 *   name: Create
 *   description: The customers managing API
 * /customer:
 *   post:
 *     summary: Create customer
 *     tags: [customers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Customer'
 *     responses:
 *       200:
 *         description: The login customer.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Customer'
 *       500:
 *         description: Some server error
 *     security: [ApiKeyAuth: [], jwt_token: []]
 */
router.post('/', limiter, validate('customerSchema'), CustomerMiddleware.validateBodyRequest, CustomerController.create);

router.post('/new-customer', CustomerController.newCustomer);
/**
 * @swagger
 * tags:
 *   name: Update
 *   description: The customers managing API
 * /customer:
 *   patch:
 *     summary: Update customer
 *     tags: [customers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Customer'
 *     responses:
 *       200:
 *         description: The update customer.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Customer'
 *       500:
 *         description: Some server error
 *     security: [ApiKeyAuth: [], jwt_token: []]
 */
router.patch('/', JWTMiddleware.validateJWTToken, CustomerMiddleware.validateUpdateRequest, CustomerController.update);
/**
 * @swagger
 * tags:
 *   name: Delete
 *   description: The customers managing API
 * /customer/{id}:
 *   delete:
 *     summary: Delete customer
 *     tags: [customers]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           example: 5f60b26b692cf083f81e3bde
 *         required: true
 *         description: Id of customer to delete
 *     responses:
 *       200:
 *         description: The delete customer.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Customer'
 *       500:
 *         description: Some server error
 *     security: [ApiKeyAuth: [], jwt_token: []]
 */
router.delete('/:id', JWTMiddleware.validateJWTToken, CustomerController.deleteOne);

/**
 * @swagger
 * tags:
 *   name: ForgotPassword
 *   description: The customers forgot password API
 * /customer/forgot-password:
 *   post:
 *     summary: Login customer
 *     tags: [customers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Login'
 *     responses:
 *       200:
 *         description: The forgot password API.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Login'
 *       500:
 *         description: Some server error
 *     security: [ApiKeyAuth: []]
 */
router.post('/forgot-password',validate('customerForgotSchema'),CustomerController.forgotPassword);

/**
 * @swagger
 * tags:
 *   name: ResetPassword
 *   description: The customers forgot password API
 * /customer/reset-password:
 *   post:
 *     summary: Login customer
 *     tags: [customers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Login'
 *     responses:
 *       200:
 *         description: The forgot password API.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Login'
 *       500:
 *         description: Some server error
 *     security: [ApiKeyAuth: []]
 */
router.post('/reset-password', validate('customerResetSchema'),JWTMiddleware.validateJWTToken, CustomerController.resetPassword);

/**
 * @swagger
 * tags:
 *   name: UpdatePassword
 *   description: The customers update password API
 * /customer/update-password:
 *   post:
 *     summary: Update password customer
 *     tags: [customers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Login'
 *     responses:
 *       200:
 *         description: The forgot password API.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Login'
 *       500:
 *         description: Some server error
 *     security: [ApiKeyAuth: []]
 */
router.post('/update-password', validate('customerUpdatePasswordSchema'),JWTMiddleware.validateJWTToken, CustomerController.updatePassword);

export default router;