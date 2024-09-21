//* Include joi to check error type 
import Joi from 'joi';
//* Include all validators
import {Validators} from '../Validators/index.js';
//import createHttpError from 'http-errors';

export const validate = (validator)=> {
    //! If validator is not exist, throw err
    if(!Validators.hasOwnProperty(validator))
        throw new Error(`'${validator}' validator is not exist`)

    return async function(req, res, next) {
        try {
            const validated = await Validators[validator].validateAsync(req.body)
            req.body = validated
            next()
        } catch (err) {
            //* Pass err to next
            //! If validation error occurs call next with HTTP 422. Otherwise HTTP 500
            // if(err.isJoi) 
            //     return next(createHttpError(422, {message: err.message}))
            // next(createHttpError(500))

            if(err.isJoi) 
                return res.json({message: err.message, type:'validationError', status : false});
            next(err);
        }
    }
}