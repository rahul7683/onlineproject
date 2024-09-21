import CountryService from '../Service/countyService.js';

export default class CountryController {

    static async create(req, res) {
        try {
            const country = await CountryService.create({
                name:req.body.name,
                domain:req.body.domain,
                countryCode : req.body.countryCode,
                logo : req.body.logo,
                languageCode : req.body.languageCode,
                allFields :req.body.allFields,
                defaultFields:req.body.defaultFields
            });
            return res.json({
                success: true,
                msg: "success",
                data: country,
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

            const country = await CountryService.findOne({
                _id: req.params.id
            });

            return res.json({
                success: true,
                msg: "success",
                data: country,
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
            const country = await CountryService.upateOne({
                id: req.body._id
            }, req.body);
            return res.json({
                success: true,
                msg: "success",
                data: country,
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
           
            const country = await CountryService.find(condition);
            return res.json({
                success: true,
                msg: "success",
                data: country,
            });

        } catch (error) {
            console.error('Error in Country list', error);
            return res.status(500).send({
                success: false,
                message: "Failed",
                error: error,
            })
        }
    }

    static async OrderSetting(req, res) {
        try {
            const country = await CountryService.upateOne({
                id: req.body._id
            }, {setting:req.body.setting});
            return res.json({
                success: true,
                msg: "success",
                data: country,
            });
        } catch (error) {

            return res.status(500).send({
                success: false,
                message: "Failed",
                error: error,
            })
        }
    }

    static async deleteOne(req, res) {
        try {

            let country = {}
            if (req.params.id) {
                country = await CountryService.deleteOne({
                    _id: req.params.id
                });
            }

            return res.json({
                success: true,
                msg: "success",
                data: country,
            });

        } catch (error) {
            return res.status(500).send({
                success: false,
                message: "Failed",
                error: error,
            })

        }
    }

}