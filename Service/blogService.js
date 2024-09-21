import blogmodel from "../Modal/blogModal.js";

export default class BlogPageService {

  static async createBlog(params) {
    return new blogmodel(params).save()
  };

  static async updateBlog(body) {
    return blogmodel.updateOne({ _id: body.id }, { $set: body }).exec()
  }

  static async getAllBlog(findCondition = {}) {
    return blogmodel
      .find(findCondition).sort({ date: -1 }).lean()
      .exec()
  };

  static async getBlogById(req) {
    return blogmodel
      .find({ _id: req.id })
      .exec()
  };

  static async deleteOne(req) {
    return blogmodel
      .deleteOne({ _id: req.id })
      .exec()
  };
}

