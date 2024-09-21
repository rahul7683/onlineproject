import BlogPageService from "../Service/blogService.js";
import { uploadinS3Promise } from "../Service/s3FileUploadService.js"

export default class BlogPageController {
    static async createBlog(req, res) {
        try {
            let location = `blog/${req.body.countryCode}/${req.file.originalname}`
            let image = await uploadinS3Promise(location, req.file.buffer)
            req.body.image = image.Location
            let blog = await BlogPageService.createBlog(req.body);
            res.json({
                success: true,
                msg: "success",
                result: blog,
            });
        } catch (err) {
            console.log("error in createBlog", err)
            res.json({
                success: false,
                message: "Failed",
                error: err,
            });
        }
    };

    static async getAllBlog(req, res) {
        let query = req.query
        let findCondition = {};
        if (query.showInHomePage && query.showInHomePage!='undefined') {
            findCondition.showInHomePage = query.showInHomePage
        }
        if (query.slug && query.slug != "undefined") {
            findCondition.slug = query.slug
        }
        if (query.countryCode && query.countryCode != 'undefined') {
            findCondition.languageCode = query.countryCode.split('-')[0];
            findCondition.countryCode = query.countryCode.split('-')[1];
        }
        let blog = await BlogPageService.getAllBlog(findCondition)
        try {
            res.json({
                success: true,
                msg: "success",
                result: blog,
            });
        } catch (err) {
            console.log("error in getAllBlog", err)
            res.json({
                success: false,
                message: "Failed",
                error: err,
            });
        }
    };

    static async getBlogById(req, res) {
        try {
            let blogById = await BlogPageService.getBlogById(req.params)
            res.json({
                success: true,
                msg: "success",
                result: blogById,
            });
        } catch (err) {
            console.log("error in getBlogById", err)
            res.json({
                success: false,
                message: "Failed",
                error: err,
            });
        }
    };

    static async updateBlog(req, res) {
        try {
            if (req.file) {
                let location = `blog/${req.body.countryCode}/${req.file.originalname}`
                let image = await uploadinS3Promise(location, req.file.buffer)
                req.body.image = image.Location
            }
            let Blog = await BlogPageService.updateBlog(req.body)
            res.json({
                success: true,
                msg: "success",
                result: Blog,
            });

        } catch (err) {
            console.log("error in updateBlog", err)
            res.json({
                success: false,
                message: "Failed",
                error: err,
            });
        };
    };

    static async deleteBlog(req, res) {
        try {
            let makeInActive = await BlogPageService.deleteOne(req.params);
            res.json({
                success: true,
                msg: "success",
                result: makeInActive,
            });

        } catch (err) {
            console.log("error in deleteBlog", err)
            res.json({
                success: false,
                message: "Failed",
                error: err,
            });
        };
    };
}

//something like that