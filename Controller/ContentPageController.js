import ContentPageService from '../Service/contentPageService.js';
import {
    uploadinS3
} from "../Service/s3FileUploadService.js"

export default class ContentPageController {

    static async create(req, res) {
        try {

            let existQuery = {
                type: req.body.type,
                countryId: req.body.countryId
            };

            if(req.body.name){
                existQuery.name = req.body.name;
            }

            const contentExisting = await ContentPageService.findOne(existQuery);

            if(contentExisting){
                return res.json({
                    success: false,
                    msg: "Content page already created, you can't add duplicate!",
                    data: {}
                });

            }

            let contentParams = {
                name:req.body.name,
                type:req.body.type,
                countryId:req.body.countryId,
                countryCode:req.body.countryCode,
                content:req.body.content,
                sections:req.body.sections,                
            }

            if(req.body.subject){
                contentParams.subject = req.body.subject;
            }

            if(req.body.languageCode){
                contentParams.languageCode = req.body.languageCode;
            }

            const contentPage = await ContentPageService.create(contentParams);
            return res.json({
                success: true,
                msg: "success",
                data: contentPage,
            });
        } catch (error) {
            return res.status(500).send({
                success: false,
                message: "Failed",
                error: error,
            })
        }

    }

    static async getOne(req, res) {
        try {

            const contentPage = await ContentPageService.findOne({
                _id: req.params.id
            });

            return res.json({
                success: true,
                msg: "success",
                data: contentPage,
            });

        } catch (error) {
            return res.status(500).send({
                success: false,
                message: "Failed",
                error: error,
            })

        }
    }

    static async update(req, res) {
        try {
            const contentPage = await ContentPageService.upateOne({
                id: req.body._id
            }, req.body);
            return res.json({
                success: true,
                msg: "success",
                data: contentPage,
            });
        } catch (error) {

            return res.status(500).send({
                success: false,
                message: "Failed",
                error: error,
            })
        }

    }

    static async list(req, res) {
        try {

            let condition = {};
            if (req.query.countryId && req.query.countryId!='undefined') {
                condition.countryId = req.query.countryId
            }
            if (req.query.type) {
                condition.type = req.query.type
            }

            if (req.query.countryCode) {
                condition.countryCode = req.query.countryCode
            }

            if (req.query.name) {
                condition.name = req.query.name
            }

            const contentPage = await ContentPageService.find(condition);
            return res.json({
                success: true,
                msg: "success",
                data: contentPage,
            });

        } catch (error) {
            console.error('Error in user list', error);
            return res.status(500).send({
                success: false,
                message: "Failed",
                error: error,
            })
        }
    }

    static async deleteOne(req, res) {
        try {

            let contentPage = {}
            if (req.params.id) {
                contentPage = await ContentPageService.deleteOne({
                    _id: req.params.id
                });
            }

            return res.json({
                success: true,
                msg: "success",
                data: contentPage,
            });

        } catch (error) {
            return res.status(500).send({
                success: false,
                message: "Failed",
                error: error,
            })

        }
    }

    static async uploadStuff(req, res) {

        /* {
          fieldname: 'testkey',
          originalname: 'Test image.jpg',
          encoding: '7bit',
          mimetype: 'image/jpeg',
          buffer: <Buffer ff d8 ff e0 00 10 4a 46 49 46 00 01 02 00 00 01 00 01 00 00 ff db 00 84 00 0a 07 07 08 07 06 0a 08 08 08 0b 0a 0a 0b 0e 18 10 0e 0d 0d 0e 1d 15 16 11 ... 39105 more bytes>,
          size: 39155
        } */

        const fileName = `countries/${req.body.countryCode}/${req.body.type}/${req.file.originalname}`;
        uploadinS3(fileName, req.file.buffer, req.file.mimetype, (error, success) => {
            if (error) {
                console.log("Error in content image upload", error);
            }
            res.send({status : 'success', data : {url:success.Location}});
        });

    }

}