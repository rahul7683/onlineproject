//* validators/index.js
import {
    orderSchema,
    orderSchemaUnsubby
} from './order.validator.js';

import {
    contactSchema
} from './contactus.validator.js';


import {
    createActionLogSchema,
    listActionLogsSchema
} from './actionlog.validator.js'

export const Validators = {
    orderSchema,
    orderSchemaUnsubby,
    contactSchema,
    createActionLogSchema,
    listActionLogsSchema
}