import searchmodel from "../Modal/searchModal.js";
import companymodel from "../Modal/CompanyModal.js";
export const createSearch = (req) => {
    return new searchmodel({
            companyId: req.companyId,
            companyName: req.companyName,
            route: req.route,
            meta: req.meta,
            date: new Date(),
        })
        .save()
};

export const getAllSearchComapny = (condition) => {
    return companymodel.find(condition, {
        companyName: 1,
        _id: 1,
        route: 1,
        category: 1, 
        orderCount: 1
    }).sort({
        orderCount: -1
    }).limit(4).lean().exec()
};