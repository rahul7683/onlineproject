//* validators/register.validator.js
import Joi from 'joi';

export const contactSchema = Joi.object({    
    name: Joi.string().required().regex(/[$\(\)<>]/, { invert: true }),
    email: Joi.string().email().required(),
    body: Joi.string().required().regex(/[<>]/, { invert: true }),
    countryCode : Joi.string().regex(/[<>]/, { invert: true }),
    orderId:Joi.string(),
    code:Joi.string(),
    type:Joi.string()  
})