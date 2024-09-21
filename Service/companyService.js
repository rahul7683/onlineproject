import companymodel from "../Modal/CompanyModal.js";
export const createCompany = (req) => {
  let date= new Date(); 
  let options = {timeZone: 'Europe/Amsterdam', year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
let eastCoastTime = (date.toLocaleString('en-US', options));
 let companyData = {
    category: req.category,
    companyName: req.companyName,
    Address: req.Address,
    addressLine : req.addressLine,
    postcode : req.postcode,
    city : req.city,
    country : req.country,
    Content: req.Content,
    Fields: req.Fields,
    Title: req.Title,
    Meta: req.Meta,
    route: req.route,
    countryId : req.countryId,
    countryCode : req.countryCode,
    paymentMethods: req.paymentMethods || [],
    date: new Date(),
  };

  if(req.postpaidMethodAmount){
     companyData.postpaidMethodAmount = req.postpaidMethodAmount;
  }

  if(req.prepaidMethodAmount){
     companyData.prepaidMethodAmount = req.prepaidMethodAmount;
  }

  if(req.currency){
     companyData.currency = req.currency;
  }
 return new companymodel(companyData)
    .save()
};

export const getAllCompany = (findCondition = {}, sort = {_id:1}, limit = 0) => { 
  
 return companymodel
    .find(findCondition,{companyName:1,_id:1,route:1,category:1})
    .populate("category", "categoryName categoryLogo")
    .sort(sort)
    .limit(limit)
    .lean()
    .exec()
};

export const getCompanyById = (req) => {
  return companymodel
    .find({ _id: req.id })
    .populate("category").lean()
    .exec()
};

export const getCompanyByCatId = (findCondition = {}) => {

  return companymodel
    .find(findCondition)
    .select('companyName countryId Title Meta category _id')
    .populate("category").lean()
    .exec()
};

export const getCompanyByroute = (findCondition) => {
  return companymodel
    .find(findCondition)
    .populate("category").lean()
    .exec()
};

export const updateCompany=(req,body) => {
 return companymodel.updateOne({_id:req.id},{$set:body}).exec()
}

export const updateOneCompanyDyno = (condition, updates) => {
    return companymodel.updateOne(condition, updates).exec()
}