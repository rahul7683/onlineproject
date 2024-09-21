import express from "express";
import multer from "multer";
const router = express.Router();
import {
    createCompanys,
    listPopularCompanyWithCategories,
    getAllCompanies,
    getCompanysByCatId,
    getCompanysById,
    getCompanysByRoute,
    updateCompanys,
    searches,
    getAllsearches,
    pushlishUnPublishCompany
} from "../Controller/CompanyController.js"

import { createSearch, getAllSearchComapny } from "../Service/searchService.js";
import {checkSearchUnique} from "../middleware/checkSearchUnique.js"
import {checkCompanyUnique} from "../middleware/checkCompanyUnique.js"
const storage = multer.diskStorage({
  destination: "./upload/category",
  filename: (req, file, cb) => {
    return cb(null, file.fieldname + Date.now() + file.originalname);
  },
});

const upload = multer({
  storage: storage,
});

/**
 * @swagger
 * components:
 *   schemas:
 *     Company:
 *       type: object
 *       required:
 *         - companyName
 *         - Title
 *         - Meta
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the book
 *         companyName:
 *           type: string
 *           description: The firstName of your book
 *         Address:
 *           type: string
 *           description: The lastName of your book
 *         addressLine:
 *           type: string
 *           description: The address lines
 *         postcode:
 *           type: string
 *           description: The lastName of your book
 *         city:
 *           type: string
 *           description: The lastName of your book
 *         country:
 *           type: string
 *           description: The lastName of your book
 *         category:
 *           type: string
 *           description: the id of category
 *         Fields:
 *           type: array
 *           description: The user email
 *         Content:
 *           type: array
 *           description: The user email
 *         route:
 *           type: string
 *           description: route-company
 *         Tittle:
 *           type: string
 *           description: The title of company
 *         Meta:
 *           type: string
 *           description: The meta of company
 *         sideLinks:
 *           type: array
 *           description: The meta of company
 *       example:
 *         id: d5fE_asz
 *         companyName: test company
 *         route: test-company
 *         Meta: test
 *         Title: test
 *         sideLinks : ['http://test.com'] 
 * 
 */
/**
 * @swagger
 * tags:
 *   name: Create company
 *   description: The comopanys managing API
 * /company:
 *   post:
 *     summary: Create company
 *     tags: [company]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Company'
 *     responses:
 *       200:
 *         description: The created company.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Company'
 *       500:
 *         description: Some server error
 *     security: [ApiKeyAuth: []]
 */
router.post("/", upload.none(),checkCompanyUnique,createCompanys);

/**
 * @swagger
 * /company/update/{id}:
 *   put:
 *     summary: Update company
 *     tags: [company]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           example: 5f60b26b692cf083f81e3bde
 *         required: true
 *         description: Id of company to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Company'
 *     responses:
 *       200:
 *         description: The created company.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Company'
 *       500:
 *         description: Some server error
 *     security: [ApiKeyAuth: []]
 */
router.put("/update/:id", upload.none(),updateCompanys);
router.post("/search", upload.none(),checkSearchUnique,searches);
router.get("/search", getAllsearches);
/**
 * @swagger
 * /company:
 *   get:
 *     summary: Get all company
 *     tags: [company]
 *     parameters:
 *       - in: query
 *         name: companyName
 *         schema:
 *           type: string
 *           example: test
 *         required: false
 *         description: Name of the company to search
 *       - in: query
 *         name: countryId
 *         schema:
 *           type: string
 *           example: 5f60b26b692cf083f81e3bde
 *         required: true
 *         description: Id of the country
 *     responses:
 *       200:
 *         description: The all company.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Company'
 *       500:
 *         description: Some server error
 *     security: [ApiKeyAuth: []]
 */
router.get("/", getAllCompanies);

/**
 * @swagger
 * /company/category/{id}:
 *   get:
 *     summary: Get companies by category id
 *     tags: [company]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           example: 5f60b26b692cf083f81e3bde
 *         required: true
 *         description: Id of company to update 
 *     responses:
 *       200:
 *         description: Get companies by category id.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Company'
 *       500:
 *         description: Some server error
 *     security: [ApiKeyAuth: []]
 */
router.get("/category/:id", getCompanysByCatId);
router.get("/route/:companyRoute", getCompanysByRoute);
/**
 * @swagger
 * /company/id/{id}:
 *   get:
 *     summary: Get company
 *     tags: [company]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           example: 5f60b26b692cf083f81e3bde
 *         required: true
 *         description: Id of company to update 
 *     responses:
 *       200:
 *         description: The created company.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Company'
 *       500:
 *         description: Some server error
 *     security: [ApiKeyAuth: []]
 */
router.get("/id/:id",getCompanysById);

/**
 * @swagger
 * /company/publish:
 *   post:
 *     summary: publish/unpublish company
 *     tags: [company]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Company'
 *     responses:
 *       200:
 *         description: The created company.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Company'
 *       500:
 *         description: Some server error
 *     security: [ApiKeyAuth: []]
 */
router.post("/publish", upload.none(),pushlishUnPublishCompany);


/**
 * @swagger
 * /company/group-popular-category:
 *   get:
 *     summary: Get all Popular category and companies for model popup
 *     tags: [company]
 *     parameters:
 *       - in: query
 *         name: countryCode
 *         schema:
 *           type: string
 *           example: fr-fr
 *         required: false
 *         description: countryCode of the country
 *     responses:
 *       200:
 *         description: Popular category and companies for model popup.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Company'
 *       500:
 *         description: Some server error
 *     security: [ApiKeyAuth: []]
 */
router.get("/group-popular-category", listPopularCompanyWithCategories);



export default router;
