//* validators/register.validator.js
import Joi from 'joi';

export const orderSchema = Joi.object({
    formData: Joi.object({
        Emailadres: Joi.string().email(),
        adres: Joi.string().regex(/[$<>]/, { invert: true }),
        addres: Joi.string().regex(/[$<>]/, { invert: true }),
        voornaam: Joi.string().required().regex(/[$\(\)<>]/, { invert: true }),
        achternaam: Joi.string().required().regex(/[$\(\)<>]/, { invert: true }),
        companyAddress: Joi.string().regex(/[$<>]/, { invert: true }),
        companyName: Joi.string().regex(/[$<>]/, { invert: true }),
        iban: Joi.string().alphanum().required(),
        woonplaats: Joi.string().required().regex(/[$<>]/, { invert: true }),
        postcode: Joi.string().required().regex(/[$\(\)<>]/, { invert: true }),
        reason: Joi.string().regex(/[<>]/, { invert: true })
    }),
    companies: Joi.array()
        .items({
            company: Joi.string().required().regex(/[$\(\)<>]/, {
                invert: true
            }),
            companyName: Joi.string().regex(/[$<>]/, {
                invert: true
            }),
            letterPdf: Joi.string().required()
        }),
    ipAddress: Joi.string().regex(/[$\(\)<>]/, { invert: true }),
    code: Joi.string().required().regex(/[$\(\)<>]/, { invert: true }),
}).options({ allowUnknown: true });

export const orderSchemaUnsubby = Joi.object({
    formData: Joi.object({
        Emailadres: Joi.string().email(),
        adres: Joi.string().regex(/[$<>]/, { invert: true }),
        addres: Joi.string().regex(/[$<>]/, { invert: true }),
        voornaam: Joi.string().required().regex(/[$\(\)<>]/, { invert: true }),
        companyAddress: Joi.string().regex(/[$<>]/, { invert: true }),
        companyName: Joi.string().regex(/[$<>]/, { invert: true }),
        woonplaats: Joi.string().required().regex(/[$<>]/, { invert: true }),
        postcode: Joi.string().required().regex(/[$\(\)<>]/, { invert: true })
        //reason: Joi.string().regex(/[<>]/, { invert: true })
    }),
    companies: Joi.array()
        .items({
            company: Joi.string().required().regex(/[$\(\)<>]/, {
                invert: true
            }),
            companyName: Joi.string().regex(/[$<>]/, {
                invert: true
            }),
            companyAddress: Joi.string().custom((value, helper) => {
                const addressArray  = value.split(',') 
                if (addressArray.length < 3) {
                    return helper.message("Invalid company address.");
                }
                return value;
            }),
            //regex(/[^(A-Za-z0-9 ,)]/, { invert: true }).regex(/[$<>]/, { invert: true }),
            letterPdf: Joi.string().required()
        }),
    /*ipAddress: Joi.string().regex(/[$\(\)<>]/, {
        invert: true
    }),*/
    code: Joi.string().required().regex(/[$\(\)<>]/, { invert: true }),
}).options({ allowUnknown: true });