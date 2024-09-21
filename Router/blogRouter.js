import express from 'express'
import multer from 'multer';
const router = express.Router()
import BlogPageController from "../Controller/blogController.js"

/**
 * @swagger
 * components:
 *   schemas:
 *     Blog:
 *       type: object
 *       required:
 *         - BlogName
 *         - Title
 *         - Meta
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the book
 *         BlogName:
 *           type: string
 *           description: The firstName of your book
 *         Title:
 *           type: string
 *           description: The lastName of your book
 *         Meta:
 *           type: string
 *           description: the id of company
 *         BlogLogo:
 *           type: string
 *           description: The user email
 *         BlogContent:
 *           type: boolean
 *           description: Whether you have password reading the book
 *         letterIntro:
 *           type: string
 *           description: The date the book was added
 *         landingPageIntro:
 *           type: string
 *           description: The date the book was added
 *         route:
 *           type: string
 *           description: The date the book was added
 *         date:
 *           type: string
 *           format: date
 *           description: The date the book was added
 *       example:
 *         id: d5fE_asz
 *         BlogName: test
 *         Title: test
 *         Meta: test
 *         date: 2020-03-10T04:05:06.157Z
 * 
 */

/**
 * @swagger
 * tags:
 *   name: Create Blog
 *   description: The Blog managing API
 * /blog:
 *   post:
 *     summary: create Blog
 *     tags: [Blog]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Blog'
 *     responses:
 *       200:
 *         description: The Blog user.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Blog'
 *       500:
 *         description: Some server error
 *     security: [ApiKeyAuth: []]
 */
router.post('/', multer().single('image'), BlogPageController.createBlog);

/**
 * @swagger
 * tags:
 *   name: Update Blog
 *   description: The Blog managing API
 * /blog:
 *   patch:
 *     summary: Update a Blog
 *     tags: [Blog]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Blog'
 *     responses:
 *       200:
 *         description: The Blog user.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Blog'
 *       500:
 *         description: Some server error
 *     security: [ApiKeyAuth: []]
 */
router.patch('/', multer().single("image"), BlogPageController.updateBlog);

/**
 * @swagger
 * tags:
 *   name: All Blog
 *   description: The Blog managing API
 * /blog:
 *   get:
 *     summary: list Blog
 *     tags: [Blog] 
 *     responses:
 *       200:
 *         description: The list of Blog.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Blog'
 *       500:
 *         description: Some server error
 *     security: [ApiKeyAuth: []]
 */
router.get('/', BlogPageController.getAllBlog);

/**
 * @swagger
 * tags:
 *   name: BlogDetail
 *   description: The Blog managing API
 * /blog/{id}:
 *   get:
 *     summary: Get a Blog detail
 *     tags: [Blog]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           example: 5f60b26b692cf083f81e3bde
 *         required: true
 *         description: Id of Blog to get detail
 *     responses:
 *       200:
 *         description: The delete Blog.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Blog'
 *       500:
 *         description: Some server error
 *     security: [ApiKeyAuth: []]
 */
router.get('/:id', BlogPageController.getBlogById);

/**
 * @swagger
 * /blog/{id}:
 *   delete:
 *     summary: Delete a Blog details
 *     tags: [Blog]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           example: 5f60b26b692cf083f81e3bde
 *         required: true
 *         description: Id of Blog to delete
 *     responses:
 *       200:
 *         description: The delete Blog.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Blog'
 *       500:
 *         description: Some server error
 *     security: [ApiKeyAuth: []]
 */
router.delete('/:id', BlogPageController.deleteBlog);

export default router; 