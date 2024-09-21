import Order from "../Modal/PaymentModal.js";
import OrderStatistics from "../Modal/OrderStatisticModel.js";
import OrderDetails from "../Modal/OrderDetailModel.js";
import CookieOrder from "../Modal/CookieOrderModel.js";


export default class OrderService {

    static async find(condition = {}, select = {'companies.letterPdf' : 0}, skip, limit) {
        return Order
            .find(condition, select)            
            .sort({_id:-1}).skip(skip).limit(limit).lean()
            .exec()
    };

    static async findWithPopulate(condition = {}, select = {'companies.letterPdf' : 0 }, skip, limit , populateJson) {
        return Order
            .find(condition, select)            
            .populate(populateJson)
            .sort({_id:-1}).skip(skip).limit(limit).lean()
            .exec()
    };

    

    static async findOne(condition = {}, select = '') {
        return Order
            .findOne(condition).select(select).lean()
            .exec()
    };

    static async findOrderStatistics(condition = {}, select = {letterPdf : 0 }, skip, limit) {
        return OrderStatistics
            .find(condition, select).sort({_id:-1}).skip(skip).limit(limit).lean()
            .exec()
    };

    static async updateOrderStatistics(condition, updateField) {
        return OrderStatistics.updateOne(condition,updateField);
    };

    static async createOrderDetails(data) {
        return new OrderDetails(data)
        .save()
    };

    static async createCookieOrder(data){
        return new CookieOrder(data).save();
    }

    static async findCookieOrder(condition){
        return CookieOrder.find(condition).lean();
    }

    static async deleteCookieOrder(condition){
        return await CookieOrder.deleteMany(condition)
    }

    static async updateCookieOrder(condition, updateField) {
        return CookieOrder.updateOne(condition,{ $set : updateField});
    };
}