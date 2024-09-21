import {
    Roles
} from '../utils/constant.js';

class ContentPageMiddleware {
    async validateBodyRequest(req, res, next) {
        if (req.body.name && req.body.type && req.body.countryId) {
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
                errors: ['Missing required fields'],
            });
        }
    }

    async validateUploadRequest(req, res, next) {
        if (req.body.type && req.body.countryCode) {
            next();
        } else {
            res.status(400).send({
                errors: ['Missing required fields'],
            });
        }
    }

}

export default new ContentPageMiddleware();