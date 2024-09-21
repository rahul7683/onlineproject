class CustomerMiddleware {
    async validateBodyRequest(req, res, next) {
        if (req.body.firstName && req.body.email) {
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

}

export default new CustomerMiddleware();