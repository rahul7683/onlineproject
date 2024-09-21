import categorymodel from "../Modal/CategoryModal.js";
import companymodel from "../Modal/CompanyModal.js";
export const createCategory = (params) => {
 return new categorymodel(params).save()
};

export const updateCategory=(params,body) => {
  return categorymodel.updateOne({_id:params.id},{$set:body}).exec()
}

export const getAllCategory = (findCondition={}) => {
  return categorymodel
    .find(findCondition).lean()
    .exec()
};

export const getCategoryById = (req) => {
  return categorymodel
    .find({ _id: req.id })
    .exec()
};

export const getCategoryByroute = async (findCondition, query) => {
  let category= await categorymodel.findOne(findCondition)
  if(category){
    let companyFindCond = { isActive : true, category: category._id};
    if(query.countryId && query.countryId!='undefined'){
      companyFindCond.countryId = query.countryId;
    }

    if(query.countryCode && query.countryCode!='undefined'){
      companyFindCond.countryCode = query.countryCode;
    }
    let company= await companymodel.find(companyFindCond,{companyName:1,route:1,_id:1})
    return [category,company]
  }else{
   return []
  }
};
