//* validators/register.validator.js
import Joi from 'joi';

export const customerSchema = Joi.object({    
    firstName: Joi.string().required().regex(/[$\(\)<>]/, { invert: true }),
    email: Joi.string().email().required(),
    lastName: Joi.string().regex(/[<>]/, { invert: true }),
    password:Joi.string().regex(/[<>]/, { invert: true }),
    contactNumber:Joi.string().regex(/[$\(\)<>]/, { invert: true }),
    city:Joi.string().required().regex(/[$\(\)<>]/, { invert: true }),  
    postal:Joi.string().regex(/[$\(\)<>]/, { invert: true }),      
    address:Joi.string().regex(/[$\(\)<>]/, { invert: true }),
    countryCode:Joi.string().regex(/[$\(\)<>]/, { invert: true }),
    languageCode:Joi.string().regex(/[$\(\)<>]/, { invert: true }),
    iban:Joi.string().regex(/[$\(\)<>]/, { invert: true }),  
    code:Joi.string(),  
})

export const customerUpdatePasswordSchema = Joi.object({    
    password:Joi.string().required().regex(/[<>]/, { invert: true }),
    oldPassword:Joi.string().required().regex(/[<>]/, { invert: true })
})


export const customerResetSchema = Joi.object({    
    password:Joi.string().required().regex(/[<>]/, { invert: true }),
})

export const customerForgotSchema = Joi.object({    
    email: Joi.string().email().required()
})


export const subscriptionSchema = Joi.object({    
    // paymentMethod: Joi.string().required()
}).options({ allowUnknown: true });
