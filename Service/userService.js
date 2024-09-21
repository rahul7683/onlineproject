import User from "../Modal/UserModel.js";

export default class UserService {
    static async create(params) {
        return new User(params).save()
    };

    static async upate(params, body) {
        return User.update({
            _id: params.id
        }, {
            $set: body
        }).exec()
    }

    static async updateOne(params, body) {
        return User.updateOne({
            _id: params.id
        }, {
            $set: body
        }).exec()
    }

    static async find(condition = {}, select = '-password') {
        return User
            .find(condition).select(select).lean()
            .exec()
    };

    static async findOne(condition = {}, select = '') {
        return User
            .findOne(condition).select(select).lean()
            .exec()
    };

    static async deleteOne(condition) {
        return User
            .deleteOne(condition);
    };
}