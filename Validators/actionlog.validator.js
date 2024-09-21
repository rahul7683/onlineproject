import Joi from 'joi';

// Validation schema for creating an action log
export const createActionLogSchema = Joi.object({
  actionBy: Joi.string().required().regex(/[$\(\)<>]/, { invert: true }).label('Action By'),
  actionName: Joi.string().required().regex(/[$\(\)<>]/, { invert: true }).label('Action Name'),
  actionOn: Joi.date().iso().required().label('Action On'), // Ensures actionOn is a valid ISO date
  actionData: Joi.object().optional().label('Action Data') // Optional object for actionData
});

export const listActionLogsSchema = Joi.object({
    page: Joi.number().integer().min(1).optional().default(1).label('Page'), // Page must be a positive integer
    limit: Joi.number().integer().min(1).optional().default(10).label('Limit'), // Limit must be a positive integer
    actionBy: Joi.string().optional().regex(/[$\(\)<>]/, { invert: true }).label('Action By'), // Optional filter for actionBy
    actionName: Joi.string().optional().regex(/[$\(\)<>]/, { invert: true }).label('Action Name') // Optional filter for actionName
  });