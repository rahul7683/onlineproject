import {
    Roles
} from '../utils/constant.js';
import CountryModel from "../Modal/CountryModel.js"

class CountryMiddleware {
    async validateBodyRequest(req, res, next) {
        if (req.body.name && req.body.domain) {
            next();
        } else {
            res.status(400).send({
                errors: ['Missing required fields'],
            });
        }
    }

    async validateUpdateRequest(req, res, next) {
        if (req.body._id) {
            next();
        } else {
            res.status(400).send({
                errors: ['Missing required field _id'],
            });
        }
    }

    async validateUnique(req, res, next) {
        const country = await CountryModel.findOne({ $or:[{'name':req.body.name}, {'domain':req.body.domain} ]});
        if (country) {
            res.status(400).send({
                errors: ['Item already Exists'],
            });
        } else {
            next();
        }
    }

}

export default new CountryMiddleware();