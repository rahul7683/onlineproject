import Country from "../Modal/CountryModel.js";

export default class CountryService {
    static async create(params) {
        return new Country(params).save()
    };

    static async upate(params, body) {
        return Country.update({
            _id: params.id
        }, {
            $set: body
        }).exec()
    }

    static async upateOne(params, body) {
        return Country.updateOne({
            _id: params.id
        }, {
            $set: body
        }).exec()
    }

    static async find(condition = {}, select = '') {
        return Country
            .find(condition).select(select).lean()
            .exec()
    };

    static async findOne(condition = {}, select = '') {
        return Country
            .findOne(condition).select(select).lean()
            .exec()
    };

    static async deleteOne(condition) {
        return Country
            .deleteOne(condition);
    };
}