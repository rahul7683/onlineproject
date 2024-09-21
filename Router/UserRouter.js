import express from 'express'
const router = express.Router()
import UserController from '../Controller/UserController.js';
import userMiddleware from '../middleware/user.middleware.js'
import JWTMiddleware from '../middleware/auth.middleware.js'

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
 *     User:
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
 *         company:
 *           type: string
 *           description: the id of company
 *         email:
 *           type: string
 *           description: The user email
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
 *   description: The users managing API
 * /user/login:
 *   post:
 *     summary: Login user
 *     tags: [users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Login'
 *     responses:
 *       200:
 *         description: The login user.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Login'
 *       500:
 *         description: Some server error
 *     security: [ApiKeyAuth: []]
 */
router.post('/login',UserController.login);
/**
 * @swagger
 * tags:
 *   name: Logout
 *   description: The users managing API
 * /user/Logout:
 *   post:
 *     summary: Logout user
 *     tags: [users] 
 *     responses:
 *       200:
 *         description: The logout user.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Login'
 *       500:
 *         description: Some server error
 *     security: [ApiKeyAuth: [], jwt_token: []]
 */
router.post('/logout',UserController.logout);
/**
 * @swagger
 * tags:
 *   name: UserDetail
 *   description: The users managing API
 * /user/{id}:
 *   get:
 *     summary: Get a user detail
 *     tags: [users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           example: 5f60b26b692cf083f81e3bde
 *         required: true
 *         description: Id of user to get detail
 *     responses:
 *       200:
 *         description: The delete user.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       500:
 *         description: Some server error
 *     security: [ApiKeyAuth: [], jwt_token: []]
 */
router.get('/:id',JWTMiddleware.validateJWTToken,userMiddleware.isAdmin,UserController.getOne);
/**
 * @swagger
 * tags:
 *   name: List
 *   description: The users managing API
 * /user:
 *   get:
 *     summary: list user
 *     tags: [users] 
 *     responses:
 *       200:
 *         description: The login user.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       500:
 *         description: Some server error
 *     security: [ApiKeyAuth: [], jwt_token: []]
 */
router.get('/',JWTMiddleware.validateJWTToken, UserController.list);
/**
 * @swagger
 * tags:
 *   name: Create
 *   description: The users managing API
 * /user:
 *   post:
 *     summary: Create user
 *     tags: [users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: The login user.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       500:
 *         description: Some server error
 *     security: [ApiKeyAuth: [], jwt_token: []]
 */
router.post('/',userMiddleware.validateBodyRequest, UserController.create);
/**
 * @swagger
 * tags:
 *   name: Update
 *   description: The users managing API
 * /user:
 *   patch:
 *     summary: Update user
 *     tags: [users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: The update user.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       500:
 *         description: Some server error
 *     security: [ApiKeyAuth: [], jwt_token: []]
 */
router.patch('/', JWTMiddleware.validateJWTToken, userMiddleware.validateUpdateRequest, UserController.update);
/**
 * @swagger
 * tags:
 *   name: Delete
 *   description: The users managing API
 * /user/{id}:
 *   delete:
 *     summary: Delete user
 *     tags: [users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           example: 5f60b26b692cf083f81e3bde
 *         required: true
 *         description: Id of user to delete
 *     responses:
 *       200:
 *         description: The delete user.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       500:
 *         description: Some server error
 *     security: [ApiKeyAuth: [], jwt_token: []]
 */
router.delete('/:id',JWTMiddleware.validateJWTToken, UserController.deleteOne);

export default router; 