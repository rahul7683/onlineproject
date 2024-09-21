import express from 'express'
import multer from 'multer';
const router = express.Router()
import {createCategories,getAllCategories,getCategoriesById,updateCategories,getCategoriesByRoute, deleteCategory,contentMigration} from "../Controller/CategoryController.js"
import {checkCatUnique} from "../middleware/checkCategoryUnique.js"
const storage = multer.diskStorage({
    destination: './upload/category',
    filename: (req, file, cb) => {
        return cb(null, file.fieldname + Date.now() + file.originalname)
    }
})

const upload = multer({ 
    storage: storage
})

/**
 * @swagger
 * components:
 *   schemas:
 *     Category:
 *       type: object
 *       required:
 *         - categoryName
 *         - Title
 *         - Meta
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the book
 *         categoryName:
 *           type: string
 *           description: The firstName of your book
 *         Title:
 *           type: string
 *           description: The lastName of your book
 *         Meta:
 *           type: string
 *           description: the id of company
 *         categoryLogo:
 *           type: string
 *           description: The user email
 *         categoryContent:
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
 *         categoryName: test
 *         Title: test
 *         Meta: test
 *         date: 2020-03-10T04:05:06.157Z
 * 
 */

/**
 * @swagger
 * tags:
 *   name: Create category
 *   description: The category managing API
 * /category:
 *   post:
 *     summary: create category
 *     tags: [category]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Category'
 *     responses:
 *       200:
 *         description: The Category user.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       500:
 *         description: Some server error
 *     security: [ApiKeyAuth: []]
 */
router.post('/',upload.none(),checkCatUnique,createCategories);

/**
 * @swagger
 * tags:
 *   name: Update category
 *   description: The category managing API
 * /category:
 *   patch:
 *     summary: Update a category
 *     tags: [category]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Category'
 *     responses:
 *       200:
 *         description: The Category user.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       500:
 *         description: Some server error
 *     security: [ApiKeyAuth: []]
 */
router.patch('/',upload.none(),updateCategories);

/**
 * @swagger
 * tags:
 *   name: All Category
 *   description: The category managing API
 * /category:
 *   get:
 *     summary: list category
 *     tags: [category] 
 *     responses:
 *       200:
 *         description: The list of category.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       500:
 *         description: Some server error
 *     security: [ApiKeyAuth: []]
 */
router.get('/',getAllCategories);

/**
 * @swagger
 * tags:
 *   name: CategoryDetail
 *   description: The category managing API
 * /category/id/{id}:
 *   get:
 *     summary: Get a category detail
 *     tags: [category]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           example: 5f60b26b692cf083f81e3bde
 *         required: true
 *         description: Id of category to get detail
 *     responses:
 *       200:
 *         description: The delete category.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       500:
 *         description: Some server error
 *     security: [ApiKeyAuth: []]
 */
router.get('/id/:id',getCategoriesById);

/**
 * @swagger
 * tags:
 *   name: CategoryByRoute
 *   description: The category managing API
 * /category/route/{id}:
 *   get:
 *     summary: Get a category detail
 *     tags: [category]
 *     parameters:
 *       - in: path
 *         name: route
 *         schema:
 *           type: string
 *           example: test
 *         required: true
 *         description: Category list by route
 *     responses:
 *       200:
 *         description: Category list by route.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       500:
 *         description: Some server error
 *     security: [ApiKeyAuth: []]
 */
router.get('/route/:route',getCategoriesByRoute);

/**
 * @swagger
 * /category/{id}:
 *   delete:
 *     summary: Delete a category details
 *     tags: [category]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           example: 5f60b26b692cf083f81e3bde
 *         required: true
 *         description: Id of category to delete
 *     responses:
 *       200:
 *         description: The delete category.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       500:
 *         description: Some server error
 *     security: [ApiKeyAuth: []]
 */
router.delete('/:id',deleteCategory);

router.get('/contentMigration', contentMigration);

export default router; 