class SubscriptionMiddleware {
    async validateBodyRequest(req, res, next) {
        console.log(req.body)
        if (req.body.countryCode == "us" || req.body.paymentMethod) {
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

export default new SubscriptionMiddleware();