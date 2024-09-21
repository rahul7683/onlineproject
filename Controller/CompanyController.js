import { createCompany,getAllCompany,getCompanyById,getCompanyByCatId,getCompanyByroute,updateCompany } from "../Service/companyService.js";
import {createSearch,getAllSearchComapny} from "../Service/searchService.js"
import CountryService from '../Service/countyService.js';


export const createCompanys = async (req, res) => {
  try{
    // if (!req.body.Address) {
    //     req.body.Address = `${req.body.addressLine},${req.body.postcode},${req.body.city},${req.body.country}`;
    // }    
    let Addcompany=await createCompany(req.body)
      res.json({
        success: true,
        msg: "success",
        result: Addcompany,
      });
  }catch(err){
    console.log(err)
    res.json({
      success: false,
      message: "Failed to insert Company",
      error: err,
    });
  }
  }

export const getAllCompanies = async (req, res) => {
  try{
      let findCondition = {
          isActive: 1
      };
      if (req.query.isAll) {
          delete findCondition.isActive
      }

      if (req.query.countryCode) {
          findCondition.countryCode = req.query.countryCode
      }else if(req.query.countryId) {
          findCondition.countryId = req.query.countryId
      }

      if(req.query.companyName){
        findCondition.companyName = new RegExp(req.query.companyName, 'i');
      }

    let getcompanys=await getAllCompany(findCondition);
    res.json({
      success: true,
      msg: "success",
      result: getcompanys,
    });
  }catch(err){
    console.log(err)
    res.json({
      success: false,
      message: "Failed",
      error: err,
    });
  } 
  }

export const getCompanysById= async (req, res) => {
  try{
    let getCompany=await getCompanyById(req.params)
    res.json({
      success: true,
      msg: "success",
      data: getCompany,
    });
  }catch(err){
    console.log(err)
    res.json({
      success: false,
      message: "Failed",
      error: err,
    });
  }
  }

export const getCompanysByRoute=async(req, res) => {
  try{
    let findCondition = {
        route: req.params.companyRoute,
        isActive : true
    };
    if (req.query.countryId && req.query.countryId!='undefined') {
        findCondition.countryId = req.query.countryId;
    }

    //get countryId by countryCode
    if(req.query.countryCode && req.query.countryCode!='undefined'){
      const country = await CountryService.findOne({countryCode:req.query.countryCode});
      findCondition.countryId = country._id;
    }

    let company= await getCompanyByroute(findCondition)
    res.json({
      success: true,
      msg: "success",
      result: company,
    });

  }catch(err){
    console.log(err)
    res.json({
      success: false,
      message: "Failed",
      error: err,
    });
  }
  }

  
export const getCompanysByCatId = async(req, res) => {
    try {
        let findCondition = {
            category: req.params.id,
            isActive: 1
        };
        if (req.query.isAll) {
            delete findCondition.isActive
        }

        if (req.query.countryCode) {
            findCondition.countryCode = req.query.countryCode
        } else if (req.query.countryId) {
            findCondition.countryId = req.query.countryId
        }
        let companyBycat = await getCompanyByCatId(findCondition)
        res.json({
            success: true,
            msg: "success",
            result: companyBycat,
        });

    } catch (err) {
        res.json({
            success: false,
            message: "Failed",
            error: err,
        });
    }
};

export const updateCompanys = async (req, res) => {
  try{

    //req.body.Address = `${req.body.addressLine},${req.body.postcode},${req.body.city},${req.body.country}`;
    
    let updatecompany=await updateCompany(req.params,req.body)
    res.json({
      success: true,
      msg: "success",
      result: updatecompany,
    });
  }catch(err){
    console.log(err)
    res.json({
      success: false,
      message: "Failed",
      error: err,
    });
  }
};

export const searches= async (req,res)=>{
  try{
    let addsearch=await createSearch(req.body)
    res.json({
      success: true,
      msg: "success",
      result: addsearch,
    });
  }catch(err){
    console.log(err)
    res.json({
      success: false,
      message: "Failed",
      error: err,
    });
  }
}

export const getAllsearches= async (req,res)=>{
  try{
    let findCondition = {
        isActive: 1
    };
    if (req.query.countryId) {
        findCondition.countryId = req.query.countryId;
    }else if (req.query.countryCode) {
        findCondition.countryCode = req.query.countryCode
    }else{
        findCondition.countryId = '653645399d3c03cfc9a160bb';
    }

    let getsearch = await getAllSearchComapny(findCondition);
    res.json({
      success: true,
      msg: "success",
      result: getsearch,
    });
  }catch(err){
    console.log(err)
    res.json({
      success: false,
      message: "Failed",
      error: err,
    })
  }
}

export const pushlishUnPublishCompany = async(req, res) => {
    try {
        const country = await updateCompany({
            id: req.body.id
        }, {
            isActive: req.body.isActive
        });
        return res.json({
            success: true,
            msg: "success",
            data: country,
        });
    } catch (error) {
        console.log('updateCompanyupdateCompany',error);
        return res.status(500).send({
            success: false,
            message: "Failed",
            error: error,
        })
    }
}


export const listPopularCompanyWithCategories = async(req, res) => {
    try {
        if (req.query.countryCode && req.query.countryCode != 'undefined') {
            const country = await CountryService.findOne({
                countryCode: req.query.countryCode
            });
            let popularCategories = country.popularCategories.splice(0, 4);
            for (const [index, category] of popularCategories.entries()) {
                popularCategories[index]['companies'] = await getAllCompany({
                    category: category._id , 
                    countryCode: req.query.countryCode
                }, {
                    orderCount: -1
                }, 5);
            }
            return res.json({
                success: true,
                msg: "success",
                result: popularCategories,
            });

        } else {
            return res.json({
                success: false,
                message: "Invalid query param in URL",
                data: {}
            });
        }

    } catch (err) {
        console.error("listPopularCompanyWithCategories ", err)
        return res.json({
            success: false,
            message: "Failed",
            error: err,
        });
    }
};