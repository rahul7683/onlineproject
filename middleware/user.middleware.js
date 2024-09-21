import {
    Roles
} from '../utils/constant.js';

class UserMiddleware {
    async validateBodyRequest(req, res, next) {
        if (req.body.company && req.body.contactNumber && req.body.firstName && req.body.lastName && req.body.email && req.body.password) {
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

    async isAdmin(req, res, next) {
        if (req.user && (req.user.role == Roles.Admin || req.user.role == Roles.SuperAdmin)) {
            next();
        } else {
            return res.status(401).send({
                message: 'Invalid access'
            });
        }
    }


}

export default new UserMiddleware();