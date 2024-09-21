import ContentPage from "../Modal/ContentPage.js";

export default class ContentPageService {
    static async create(params) {
        return new ContentPage(params).save()
    };

    static async upate(params, body) {
        return ContentPage.update({
            _id: params.id
        }, {
            $set: body
        }).exec()
    }

    static async upateOne(params, body) {
        return ContentPage.updateOne({
            _id: params.id
        }, {
            $set: body
        }).exec()
    }

    static async find(condition = {}, select = '') {
        return ContentPage
            .find(condition).select(select).sort({_id:-1}).lean()
            .exec()
    };

    static async findOne(condition = {}, select = '') {
        return ContentPage
            .findOne(condition).select(select).lean()
            .exec()
    };

    static async deleteOne(condition) {
        return ContentPage
            .deleteOne(condition);
    };
}