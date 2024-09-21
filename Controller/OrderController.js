import OrderService from '../Service/orderService.js';
import EmailTemplate from '../unsubby/EmailTemplates/index.js';
import moment from 'moment';
import { getLetterApi } from './PingenletterApiController.js';
import {
    updateOrderMany,
    addPayment,
    getFilteredOrderCount,
    runAggregate
} from "../Service/paymentService.js";
//Postbode letter creation
import {
    createLetter
} from "./LetterController.js";
import {
    createPaymentMollie
} from '../Service/mollieService.js';
import {
    uploadinS3
} from "../Service/s3FileUploadService.js"
import PingenLetter from '../unsubby/Service/pingenLetter.js';
import MySendingBoxLetter from '../unsubby/Service/mysendingboxLetter.js';
import {
    sendErrorNotification
} from '../Service/commonService.js';
import fs from 'fs';
import ibantools from "ibantools"
import orderid from "order-id";
import {
    LETTER_DOWNLOAD_URL
} from '../config.js';
import {
    sendEmailUnsubby
} from "../Service/emailService.js";
import {
    SupportEmail,
    CountryData,
    LetterStatus
} from '../utils/constant.js';
export default class OrderController {

    static async panelCustomerList(req, res) {
        try {

            let condition = {};
            let skip = 0;
            let limit = 20;
            if (req.body.dateFrom) {
                condition.date = {
                    $gte: new Date(moment(req.body.dateFrom))
                }
            }

            if (req.body.dateTo) {
                if (req.body.dateFrom) {
                    condition.date = {
                        $lte: new Date(moment(req.body.dateTo).add(24, 'hours')),
                        $gte: new Date(moment(req.body.dateFrom))
                    };
                } else {
                    condition.date = {
                        $lte: new Date(moment(req.body.dateTo).add(24, 'hours')),
                    };
                }
            }

            if (req.body.countryId) {
                condition.countryId = req.body.countryId;
            }

            condition.dbCustomerId = {
                $exists: true
            }
            console.log("conditioncondition", condition);
            let aggregateQuery = [{
                "$match": condition
            }, {
                "$group": {

                    _id: "$countryCode",
                    count: {
                        $sum: 1
                    }
                }
            }];


            const data = await runAggregate(aggregateQuery);
            return res.json({
                success: true,
                msg: "success",
                data: data,
            });

        } catch (error) {
            console.error('Error in customer order list', error);
            return res.status(500).send({
                success: false,
                message: "Failed",
                error: error,
            })
        }
    }

    static async getOne(req, res) {
        try {

            const country = await OrderService.findOne({
                _id: req.params.id
            });

            return res.json({
                success: true,
                msg: "success",
                data: country,
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
                condition.momentDate = {
                    $gte: moment(req.body.dateFrom)
                }
            }

            if (req.body.dateTo) {
                if (req.body.dateFrom) {
                    condition.momentDate = {
                        $lte: moment(req.body.dateTo),
                        $gte: moment(req.body.dateFrom)
                    };
                } else {
                    condition.momentDate = {
                        $lte: moment(req.body.dateTo)
                    };
                }
            }

            if (req.body.status) {
                condition['paymentResponse.status'] = req.body.status;
            }

            if (req.body.countryId) {
                condition.countryId = req.body.countryId;
            }

            if (req.body.company) {
                condition.company = req.body.company;
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

            if (req.body.letterStatus) {
                condition.letterStatus = LetterStatus[req.body.letterStatus];
            }

            if (req.body.pageSize) {
                skip = req.body.pageSize * (req.body.pageNumber - 1);
            }

            if (req.body.pageSize) {
                limit = req.body.pageSize;
            }

            if (req.body.customerId || (req.customer && req.customer.customerId)) {
                condition.dbCustomerId = req.body.customerId || req.customer.customerId;
            }
            console.log("conditioncondition", condition);
            let data = [];
            //populate : {path :'companies.company', select'route Fields'};
            if (req.body.populate) {
                data = await OrderService.findWithPopulate(condition, {
                    'companies.letterPdf': 0
                }, skip, limit, req.body.populate);
            } else {
                data = await OrderService.find(condition, {
                    'companies.letterPdf': 0
                }, skip, limit);
                // Check if data and data[0].companies are available
                if (req.body.letterTracking) {
                    if (data && data[0] && data[0].companies) {
                        // Create an array of promises to fetch letter data
                        const promises = data[0].companies.map(async (company) => {
                            try {
                                let letterdata = await getLetterApi(company.letterId);
                                return {
                                    companyId: company.id,
                                    status: letterdata.data.data.attributes.status,
                                    updated_at: letterdata.data.data.attributes.updated_at
                                };
                            } catch (error) {
                                console.error(`Error fetching letter data for company ${company.id}:`, error);
                                // Optionally return a default or null status
                                return {
                                    companyId: company.id,
                                    status: null,
                                    updated_at: null
                                };
                            }
                        });

                        // Use Promise.all to wait for all promises to resolve
                        try {
                            const allLetterData = await Promise.all(promises);
                            const statusMap = allLetterData.reduce((acc, { companyId, status, updated_at }) => {
                                const timestamp = new Date(updated_at);
                                const now = new Date();
                                const timeDifference = now - timestamp;
                                const differenceInHours = timeDifference / (1000 * 60 * 60);
                                const isGreaterThan72Hours = differenceInHours > 72;
                                switch (status) {
                                    case "processing": status = LetterStatus.Created
                                        break;
                                    case "printing": status = LetterStatus.processed_for_delivery
                                        break;
                                    case "sent": status = isGreaterThan72Hours? LetterStatus.completed :LetterStatus.Deliverd
                                        break;
                                }
                                acc[companyId] = status;
                                return acc;
                            }, {});
                            data[0].companies = data[0].companies.map((company) => {
                                return {
                                    ...company,
                                    letterStatus: statusMap[company.id] || 'Status not available'
                                };
                            });
                        } catch (error) {
                            console.error('Error processing letter data:', error);
                        }
                    } else {
                        console.log('No companies data available');
                    }
                }
            }
            const orderCount = await getFilteredOrderCount(condition);
            return res.json({
                success: true,
                msg: "success",
                data: data,
                totalCount: orderCount
            });

        } catch (error) {
            console.error('Error in Country list', error);
            return res.status(500).send({
                success: false,
                message: "Failed",
                error: error,
            })
        }
    }

    static async stopReminder(req, res) {
        try {

            const data = await updateOrderMany({
                orderId: {
                    $in: req.body.orderId
                }
            }, {
                chargedBackUpdatedAt: null,
                failedUpdatedAt: null
            });

            return res.json({
                success: true,
                msg: "success",
                data: data,
            });

        } catch (error) {
            return res.status(500).send({
                success: false,
                message: "Failed",
                error: error,
            })

        }
    }

    static async getStatistics(req, res) {
        try {

            const data = await OrderService.findOrderStatistics({});

            return res.json({
                success: true,
                msg: "success",
                data: data,
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

            let langCodeOnly = req.body.countryCode.split('-')[0];
            let countryCodeOnly = req.body.countryCode.split('-')[1];

            let iban = req.body?.formData?.iban.toUpperCase();
            iban = iban.replaceAll(' ', '');
            let isValidIban = ibantools.isValidIBAN(iban)
            if (!isValidIban) {
                return res.json({
                    status: false,
                    type: "iban",
                    message: "Het IBAN-nummer is ongeldig. Vul een geldig IBAN-nummer in."
                })
            }
            let payment = req.body;
            payment.IBAN = iban;
            delete req.body?.formData?.iban

            payment.countryCodeOnly = countryCodeOnly;
            let order_id = 'ORD-' + orderid().generate();
            payment.orderId = order_id;
            let paymentResponse = {};
            if (payment.createPayment) {
                paymentResponse = await createPaymentMollie(payment);
            }

            if (paymentResponse) {
                let letterContent = {
                    voornaam: payment?.formData?.voornaam,
                    achternaam: payment?.formData?.achternaam,
                    Adres: payment?.formData.Adres || payment?.formData.address || payment?.formData.adres,
                    Emailadres: payment?.formData?.Emailadres,
                    datumdate: payment?.formData?.datumdate,
                    klantnummer: payment?.formData?.klantnummer,
                    reason: payment?.formData?.reason,
                };
                payment.countryCode = countryCodeOnly;
                payment.languageCode = langCodeOnly;
                payment.letterContent = letterContent;


                let filename = payment.companyName + "-" + order_id;
                uploadinS3(`pdf/unsubby/${countryCodeOnly}/${filename}.pdf`, payment.letterPdf, null, async (error, success) => {

                    const downloadUrl = `${LETTER_DOWNLOAD_URL}unsubby/${countryCodeOnly}/${filename}.pdf`;
                    payment.letterContent.downloadUrl = downloadUrl;
                    payment.paymentVendor = 'stripe';
                    let company = {
                        companyName: payment.companyName
                    }

                    if (payment.sendEmail) {
                        let {
                            htmlContent,
                            subject
                        } = await EmailTemplate.getPaymentConfirmationEmail(langCodeOnly, {
                            letterContent,
                            company,
                            downloadUrl,
                            order_id,
                            countryCode: countryCodeOnly
                        });

                        sendEmailUnsubby({
                            to: payment.formData?.Emailadres,
                            subject: subject,
                            body: htmlContent,
                            replyTo: SupportEmail[payment.countryCode]
                        });
                    }

                    try {


                        if (langCodeOnly == 'fr') {
                            const letterResponse = await MySendingBoxLetter.sendLetter(payment.companyName, payment.letterContent, order_id);
                            payment.letterId = letterResponse.data._id;
                            payment.letterPdf = '';
                            addPayment(payment);
                        } else {
                            fs.writeFile(`${order_id}.pdf`, payment.letterPdf, {
                                encoding: 'base64'
                            }, async function (err) {
                                try {
                                    const file1 = fs.readFileSync(`${order_id}.pdf`);
                                    const blob1 = Buffer.from(file1);

                                    const letterResponse = await PingenLetter.sendLetter(payment.companyName, blob1, order_id);

                                    payment.letterId = letterResponse.data.data.id;
                                    payment.letterPdf = '';
                                    if (payment.addInDb) {
                                        addPayment(payment);
                                    }
                                    console.log('File created');
                                    fs.unlink(`${order_id}.pdf`, function (err) {
                                        console.log('deleted')
                                    });

                                } catch (error) {
                                    if (payment.addInDb) {
                                        addPayment(payment);
                                    }

                                    console.error('Error in Pingin letter create CMS', error);
                                    sendErrorNotification('Unsubby : Error in Pingin letter create CMS ' + order_id, error);

                                }
                            });

                        }

                    } catch (error) {
                        if (payment.addInDb) {
                            addPayment(payment);
                        }
                        console.error('Error in letter create CMS', error);
                        sendErrorNotification('Unsubby : Error in letter create CMS ' + order_id, error);

                    }

                });

            }

            return res.json({
                success: true,
                msg: "success",
                data: paymentResponse,
            });

        } catch (error) {
            console.error(error);
            return res.status(500).send({
                success: false,
                message: "Failed",
                error: error,
            })

        }
    }

    static async createCookieOrder(req, res) {
        try{

            let langCodeOnly = req.body.countryCode.split('-')[0];
            let countryCodeOnly = req.body.countryCode.split('-')[1];
            req.body.countryCode = countryCodeOnly;
            req.body.languageCode = langCodeOnly;
            const isOrderExists = await OrderService.findCookieOrder({
                'letterContent.Emailadres': req.body.letterContent.Emailadres,
                'companies.company': req.body.companies[0].company
            });

            if (isOrderExists && isOrderExists.length>0) {
                return res.json({
                    success: true,
                    msg: "success",
                    data: isOrderExists[0],
                });
            }

            const cookieOrder = await OrderService.createCookieOrder(req.body);
            return res.json({
                success: true,
                msg: "success",
                data: cookieOrder,
            });

        } catch (error) {
            console.error('Error in createCookieOrder', error);
            return res.status(500).send({
                success: false,
                message: "Failed",
                error: error,
            })

        }
    }

}