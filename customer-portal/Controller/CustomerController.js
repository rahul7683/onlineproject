import bcrypt from 'bcrypt';
import JWTMiddleware from '../Middleware/auth.middleware.js';
import CustomerService from '../Service/customerService.js';
import SubscriptionMollieService from '../Service/subscriptionMollieService.js';
import moment from 'moment';
import { verifyReCaptchToken } from '../../Service/commonService.js';

//import crypto from 'crypto';
import {
    UNSUBBY_WEBSITE,
    ABBOSTOP_WEBSITE
} from '../../config.js'

import EmailTemplate from '../../unsubby/EmailTemplates/index.js';
import {
    sendEmail,
    sendEmailUnsubby
} from "../../Service/emailService.js";
import {
    addDelay
} from "../../Service/commonService.js";


export default class CustomerController {

    static async login(req, res) {
        try {


            let customerFind = {
                email: req.body.email.toLowerCase()
            };
            if (req.body.loginCode) {
                customerFind.loginCode = req.body.loginCode;
            }
            const customer = await CustomerService.findOne(customerFind);


            if (!customer) {
                return res.status(400).send({
                    success: false,
                    message: "Invalid customer",
                    messageKey: 'emailNotFound'
                })
            }
            const match = await bcrypt.compare(req.body.password, customer.password);
            if (match) {


                delete customer.password;
                delete customer.loginCode;
                let customerObject = customer.toObject();


                //if (req.body.loginCode) {
                const createToken = await JWTMiddleware.generateJWTToken(customer);
                customerObject.token = createToken;
                /*} else {
                    const loginCode = Math.floor(1000 + Math.random() * 9000);
                    sendEmail({
                        subject: 'My unsubby Login code',
                        to: customer.email,
                        body: 'Dear ' + customer.firstName + ' , <p>Please use this code to login into CMS - ' + loginCode + ' </p>'
                    });
                    CustomerService.updateOne({
                        _id: customer._id
                    }, {
                        loginCode: loginCode
                    });
                }*/
                //customer.isLoggedIn = true;
                customer.lastLoggedInAt = new Date();
                customer.save();

                return res.json({
                    success: true,
                    msg: "success",
                    data: customerObject
                });


            } else {
                return res.status(400).send({
                    success: false,
                    message: "Invalid customer",
                    messageKey: 'incorrectPassword'
                })

            }

        } catch (error) {
            console.error('Error in customer login', error);
            return res.status(500).send({
                success: false,
                message: "Failed",
                messageKey: 'Failed',
                error: error,
            })
        }

    }

    static async logout(req, res) {
        try {

            await JWTMiddleware.clearToken(req);
            return res.json({
                success: true,
                msg: "success",
                data: {}
            });

        } catch (error) {

            return res.status(500).send({
                success: false,
                message: "Failed",
                error: error,
            })
        }

    }
    static async create(req, res) {
        try {

            const isGTokenVerified = await verifyReCaptchToken(req, 'v3', req.body.code);
            if (!isGTokenVerified) {
                console.log("Bodyyyyyyy", req.body?.formData)
                return res.json({
                    status: false,
                    type: "test",
                    message: "Invalid data."
                })
            }

            return res.json({
                success: true,
                mes: "success",
                messageKey: 'customerAccountCreated',
                data: {},
            });

            /*const customerExists = await CustomerService.findOne({email:req.body.email.toLowerCase()});
            if (customerExists) {
                return res.status(400).send({
                    success: false,
                    message: "Customer with this email already exists.",
                    messageKey: 'emailExists'
                })
            }

            req.body.credit = {
                available: 0,
                used: 0
            };
            let enteredPassword = req.body.password;
            let data = await CustomerService.createPasswordHash(req.body);
            data.email = data.email.toLowerCase();
            let customer = await CustomerService.create(data);
            delete customer.password;

            res.json({
                success: true,
                mes: "success",
                messageKey:'customerAccountCreated',
                data: customer,
            });

           EmailTemplate.getEmailFromDB(req.body.languageCode, {
                type: "Customer",
                name: "welcomeEmail",
                countryCode: req.body.countryCode,
                to : req.body.email
            }, {
                firstName: req.body.firstName,
                password: enteredPassword
            });*/


        } catch (error) {

            return res.status(500).send({
                success: false,
                message: "Failed",
                error: error,
            })
        }
    }

    static async getOne(req, res) {
        try {

            if (!req.customer || !req.customer.customerId) {
                return res.status(401).send({
                    success: false,
                    message: "Failed , invalid user",
                    messageKey: 'invalidToken'

                })
            }

            const customer = await CustomerService.findOne({
                _id: req.customer.customerId
            });

            let mandateDetail = {};

            if (customer.subscriptionResponse && customer.subscriptionResponse.mandateId) {

                const mandateId = customer.subscriptionResponse.mandateId;
                try {
                    mandateDetail = await SubscriptionMollieService.getCustomerMandateDetail({
                        mandateId: mandateId,
                        customerId: customer.mollie.customerId
                    })
                } catch (mandateeror) {
                    console.log("Mandate error in get customer", mandateeror)
                }
            }


            let customerObject = customer.toObject();
            customerObject.mandateResponse = mandateDetail;


            return res.json({
                success: true,
                msg: "success",
                data: customerObject,
            });

        } catch (error) {
            console.error('Error in get customer API', error);
            return res.status(500).send({
                success: false,
                message: "Failed",
                error: error,
            })

        }
    }

    static async getOneOpen(req, res) {
        try {

            const customer = await CustomerService.findOne({
                _id: req.params.id
            });


            return res.json({
                success: true,
                msg: "success",
                data: customer,
            });

        } catch (error) {
            return res.status(500).send({
                success: false,
                message: "Failed",
                error: error,
            })

        }
    }

    static async update(req, res) {
        try {
            delete req.body.password;
            const customer = await CustomerService.updateOne({
                _id: req.body._id
            }, req.body);

            return res.json({
                success: true,
                msg: "success",
                messageKey: 'updatedSuccefuly',
                data: customer,
            });
        } catch (error) {

            return res.status(500).send({
                success: false,
                message: "Failed",
                error: error,
            })
        }

    }

    static async list(req, res) {
        try {

            let condition = {};
            let skip = 0;
            let limit = 20;
            if (req.body.dateFrom) {
                condition.createdAt = {
                    $gte: moment(req.body.dateFrom)
                }
            }

            if (req.body.dateTo) {
                if (req.body.dateFrom) {
                    condition.createdAt = {
                        $lte: moment(req.body.dateTo).add(24, 'hours'),
                        $gte: moment(req.body.dateFrom)
                    };
                } else {
                    condition.createdAt = {
                        $lte: moment(req.body.dateTo).add(24, 'hours'),
                    };
                }
            }

            if (req.body.status) {
                condition['paymentResponse.status'] = req.body.status;
            }

            if (req.body.countryId) {
                condition.countryId = req.body.countryId;
            }

            if (req.body.countryCode) {
                condition.countryCode = req.body.countryCode;
            }

            if (req.body.orderId) {
                condition.orderId = req.body.orderId;
            }

            if (req.body.bankReasonCode && req.body.bankReasonCode.length > 0) {
                condition['paymentResponse.details.bankReasonCode'] = {
                    $in: req.body.bankReasonCode
                };
            }

            if (req.body.emailBounced) {
                condition.emailBounced = req.body.emailBounced;
            }

            if (req.body.reminderCount) {
                condition.reminderCount = req.body.reminderCount;
            }


            if (req.body.pageSize) {
                skip = req.body.pageSize * (req.body.pageNumber - 1);
            }

            if (req.body.pageSize) {
                limit = req.body.pageSize;
            }

            if (req.body.subscriptionStatus && req.body.subscriptionStatus.length > 0) {
                condition.$or = [];
                let isTrialIncluded = false;
                for (const item of req.body.subscriptionStatus) {
                    if (item == 'active' || item == 'canceled') {
                        condition.$or.push({
                            'subscriptionResponse.status': item
                        })
                    }

                    if (item == 'trial') {
                        isTrialIncluded = true
                    }
                }

                if (condition.$or.length == 0) {
                    delete condition.$or;
                }

                if (isTrialIncluded) {
                    condition.$expr = {
                        "$gte": [{
                            "$dateFromString": {
                                "dateString": "$subscriptionResponse.startDate"
                            }
                        }, new Date()]
                    }
                } else {
                    condition.$expr = {
                        "$lt": [{
                            "$dateFromString": {
                                "dateString": "$subscriptionResponse.startDate"
                            }
                        }, new Date()]
                    }
                }
            }

            if (req.body.searchText) {
                let searchString = new RegExp(`${req.body.searchText}`, 'i');
                condition.$or =
                    [{
                        'subscriptionResponse.description': searchString
                    }, {
                        firstName: searchString
                    }, {
                        email: searchString
                    }]
            }


            console.log("conditioncondition", condition);
            const customerCount = await CustomerService.getCustomerCount(condition);
            const customers = await CustomerService.find(condition, skip, limit);
            return res.json({
                success: true,
                msg: "success",
                data: customers,
                totalCount: customerCount
            });

        } catch (error) {
            console.error('Error in customer list', error);
            return res.status(500).send({
                success: false,
                message: "Failed",
                error: error,
            })
        }
    }

    static async deleteOne(req, res) {
        try {

            let customer = {}
            if (req.params.id) {
                customer = await CustomerService.deleteOne({
                    _id: req.params.id
                });
            }

            return res.json({
                success: true,
                msg: "success",
                data: customer,
            });

        } catch (error) {
            return res.status(500).send({
                success: false,
                message: "Failed",
                error: error,
            })

        }
    }


    static async setCustomerCountry(req, res) {
        try {

            req.customer.countryId = req.body.countryId;
            console.log("req.customer", req.customer);
            return res.json({
                success: true,
                msg: "success",
                data: customer,
            });

        } catch (error) {
            return res.status(500).send({
                success: false,
                message: "Failed",
                error: error,
            })

        }
    }

    static async forgotPassword(req, res) {
        try {

            let customerFind = {
                email: req.body.email.toLowerCase()
            };

            const customer = await CustomerService.findOne(customerFind);

            if (!customer) {
                return res.status(400).send({
                    success: false,
                    message: "Invalid customer",
                    messageKey: 'emailNotFound'
                })
            }

            //const token = crypto.randomBytes(64).toString('hex');
            const token = await JWTMiddleware.generateJWTToken(customer);
            let websiteURL = customer.countryCode == 'nl' ? ABBOSTOP_WEBSITE : UNSUBBY_WEBSITE;
            const resetURL = `${websiteURL}/${customer.languageCode}-${customer.countryCode}/my-unsubby/reset-password?token=${token}`;

            EmailTemplate.getEmailFromDB(customer.languageCode, {
                type: "Customer",
                name: "forgotPasswordEmail",
                countryCode: customer.countryCode,
                to: customer.email
            }, {
                resetLink: resetURL,
                firstName: customer.firstName
            })

            /*sendEmailUnsubby({
                to: customer.email
                subject: subject,
                body: htmlContent

            });*/

            return res.json({
                success: true,
                msg: "success",
                messageKey: 'forgotPasswordEmailSent',
                data: customer,
                token: token
            });

        } catch (error) {
            console.log("Error", error)
            return res.status(500).send({
                success: false,
                message: "Failed",
                error: error,
            })

        }

    }


    static async resetPassword(req, res) {
        try {

            if (!req.customer || !req.customer.customerId) {
                return res.status(401).send({
                    success: false,
                    message: "Failed , invalid user",
                    messageKey: 'invalidToken'

                })
            }


            const salt = bcrypt.genSaltSync(12);
            req.body.password = bcrypt.hashSync(req.body.password, salt);


            const customer = await CustomerService.updateOne({
                _id: req.customer.customerId
            }, {
                password: req.body.password
            });

            return res.json({
                success: true,
                msg: "success",
                messageKey: 'resetPasswordDone',
                data: {},
            });

        } catch (error) {
            console.log("Error", error)
            return res.status(500).send({
                success: false,
                message: "Failed",
                error: error,
            })

        }

    }

    static async updatePassword(req, res) {
        try {

            if (!req.customer || !req.customer.customerId) {
                return res.status(401).send({
                    success: false,
                    message: "Failed , invalid user",
                    messageKey: 'invalidToken'

                })
            }
            let customerFind = {
                _id: req.customer.customerId
            };

            const customer = await CustomerService.findOne(customerFind);

            if (!customer) {
                return res.status(401).send({
                    success: false,
                    message: "Invalid customer",
                    messageKey: 'invalidToken'
                })
            }
            const match = await bcrypt.compare(req.body.oldPassword, customer.password);
            if (match) {

                const salt = bcrypt.genSaltSync(12);
                const password = bcrypt.hashSync(req.body.password, salt);

                const customer = await CustomerService.updateOne({
                    _id: req.customer.customerId
                }, {
                    password: password
                });

                return res.json({
                    success: true,
                    msg: "success",
                    messageKey: 'updatedSuccefuly',
                    data: customer
                });


            } else {
                return res.status(400).send({
                    success: false,
                    messageKey: 'incorrectOldPassword',
                    message: "In-correct old password"
                })

            }

        } catch (error) {
            console.error('Error in customer update password API', error);
            return res.status(500).send({
                success: false,
                message: "Failed",
                error: error,
            })
        }


    }

    static async newCustomer(req, res) {
        try {

            //494 customers
            let condition = {
                paymentResponse: {
                    $exists: true
                },
                //countryCode: 'us',
                createdAt: {
                    $gte: new Date('2024-09-07T08:35:24.508+00:00'),
                    $lte: new Date('2024-09-09T08:35:45.307+00:00')
                }
                //email : 'lavkeshtestde6@onlinepartnership.nl'
            }

            const users = await CustomerService.find(condition);

            for (const customer of users) {

                let password = await CustomerService.generatePassword(customer);
                //customer.password = password;
                let genHash = await CustomerService.createPasswordHash({ password: password });

                CustomerService.updateOne({ _id: customer._id }, {
                    password: genHash.password
                })

                await addDelay(300);
                //Sent the email again if subscription is not active
                EmailTemplate.getEmailFromDB(customer.languageCode, {
                    type: "Customer",
                    name: "welcomeEmailUpsell",
                    countryCode: customer.countryCode,
                    to: customer.email
                }, {
                    firstName: customer.firstName,
                    password: password
                });

            }

            return res.status(200).send({
                success: true,
                message: "message",
            })

        } catch (error) {
            console.error('Error in user list', error);
            return res.status(500).send({
                success: false,
                message: "Failed",
                error: error,
            })
        }


    }


}