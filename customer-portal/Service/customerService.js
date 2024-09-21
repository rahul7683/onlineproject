import bcrypt from 'bcrypt';
import Customer from "../Model/CustomerModel.js";
import orderid from "order-id";
import SubscriptionService from './subscriptionService.js';
import {
    sendErrorNotification
} from '../../Service/commonService.js';
import EmailTemplate from '../../unsubby/EmailTemplates/index.js';
import StripeService from '../../unsubby/Service/stripeService.js';
import { getDate, getMonth } from 'date-fns';
import { TimeStamp_To_yyyy_mm_dd } from '../../utils/FormatDate.js';

export default class CustomerService {
    static async create(params) {
        return new Customer(params).save()
    };

    static async upateDyno(condition, updateBody) {
        return Customer.updateOne(condition, updateBody).exec()
    }

    static async updateOne(condition, body) {
        return Customer.updateOne(condition, {
            $set: body
        }).exec()
    }

    static async find(condition = {}, skip = 0, limit = 1000, select = '-password') {
        return Customer
            .find(condition).sort({ _id: -1 }).select(select).skip(skip).limit(limit).lean()
            .exec()
    };

    static async findOne(condition = {}, select = '') {
        return Customer
            .findOne(condition).select(select)
            .exec()
    };

    static async deleteOne(condition) {
        return Customer
            .deleteOne(condition);
    };

    static async generatePassword(user) {
        let ids = orderid().generate().split('-');
        const password = user.firstName.substr(0, 2).toLowerCase() + '#' + ids[ids.length - 1];
        return password;
    }

    static async createPasswordHash(data) {
        let password = data.password;
        if (!data.password) {
            //Generate random password
            password = await CustomerService.generatePassword(data);
        }

        const salt = bcrypt.genSaltSync(12);
        data.password = bcrypt.hashSync(password, salt);
        return data;
    }

    static async createCustomerAndSubscription(data) {
        try {

            let password = '';

            let customerData = {
                firstName: data.letterContent.voornaam,
                lastName: '',
                email: data.letterContent.Emailadres.toLowerCase(),
                address: data.letterContent.adres,
                postal: data.letterContent.postcode,
                city: data.letterContent.woonplaats,
                countryCode: data.countryCode,
                languageCode: data.languageCode,
                credit: {
                    available: 2
                },
                //password: password,
                amount: data.amount || 4.95,

            }

            if (!data.password) {
                //Generate random password
                customerData.password = await CustomerService.generatePassword(customerData);
                password = customerData.password;
            }

            customerData = await CustomerService.createPasswordHash(customerData);
            let customer = null;

            //check if email already exists, if yes update the password just
            customer = await CustomerService.findOne({ email: customerData.email });
            if (customer) {
                const subscriptionStatuses = ['active', 'trialing', 'pending'];
                if (customer.subscriptionResponse && subscriptionStatuses.indexOf(customer.subscriptionResponse.status)>-1) {
                    return; //do nothing
                }
            }

            //If no customer then create customer , else create subscription
            if (!customer) {
                customer = await CustomerService.create(customerData);
            }

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

            if (data.paymentResponse) {
                customerData.paymentMethod = data.paymentResponse.method;
                customerData.customerId = data.paymentResponse.customerId;
                customerData.mandateId = data.paymentResponse.mandateId;
                customerData.trial = true;
            }

            // update stripe customer with payment id
            if (data.countryCode == "us") {
                await StripeService.updateCustomer(data.paymentResponse)
                delete customerData.mandateId
            }

            //Now create subscription for after 7 days deduction
            const subscriptionResponse = await SubscriptionService.createSubscription(customerData);
            
            //do nothing if subscriptionResponse has an error
            if (subscriptionResponse.error) {                   
                return;
            };
            //update customerId and payment into db
            const updateCustomer = await CustomerService.updateOne({
                _id: customer._id
            }, {
                subscriptionResponse: subscriptionResponse,
                paymentResponse:data.paymentResponse,
                mollie: {
                    customerId: subscriptionResponse.customerId || subscriptionResponse.customer,
                    nextPaymentDate: subscriptionResponse.nextPaymentDate || TimeStamp_To_yyyy_mm_dd(subscriptionResponse.current_period_end)
                },
                password: customerData.password,
                credit: { available: 2, used: 0 }
            });

        } catch (error) {
            console.error("Error " + data.letterContent.Emailadres, error);
            sendErrorNotification('Unsubby : Error in createCustomerAndSubscription ' + data.letterContent.Emailadres, error);
        }


    }

    static async getCustomerCount(condition) {
        return Customer
            .count(condition);
    }

    static async cancelSubscription(data){
        return SubscriptionService.cancelSubscription(data);

    }
}