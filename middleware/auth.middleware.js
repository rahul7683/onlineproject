import jwt from 'jsonwebtoken';
import {
    JWT_SECRET,
    TOKEN_HEADER_KEY
} from '../config.js';
export default class JWTMiddleware {

    static async generateJWTToken(user) {
        let data = {
            time: Date(),
            userId: user._id,
            role: user.roles,
            countryId : user.countryId
        }
        const token = await jwt.sign(data, JWT_SECRET, {
            expiresIn: '7d'
        });
        return token;
    }

    static async validateJWTToken(req, res, next) {
        try {
            const token = req.header(TOKEN_HEADER_KEY) || req.header('keytoken') || req.headers.keytoken || req.headers.authorization.split(' ')[1];
            const verified = await jwt.verify(token, JWT_SECRET);
            if (verified) {
                req.user = verified;
                next();
            } else {
                // Access Denied
                return res.status(401).send({
                    message: 'Invalid user'
                });
            }
        } catch (error) {
            console.error('Error in validateJWTToken', error);
            // Access Denied
            return res.status(401).send(error);
        }
    }

    static async clearToken(req) {
        try {
            const token = req.header(TOKEN_HEADER_KEY);
            delete req.user;
            await jwt.destroy(token);
            return true
        } catch (error) {
            console.error('Error in clearToken', error);
            return false;
        }
    }

}