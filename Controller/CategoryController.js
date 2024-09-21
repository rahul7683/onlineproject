import {
  createCategory,
  getAllCategory,
  getCategoryById,
  updateCategory,
  getCategoryByroute
} from "../Service/categoryService.js";

export const createCategories = async (req, res) => {
  try {

    if(req.body.countryCode){
      req.body.languageCode = req.body.countryCode.split('-')[0];
    }
    
    //let countryCodeOnly  = req.body.countryCode.split('-')[1];

    let category = await createCategory(req.body);
    res.json({
      success: true,
      msg: "success",
      result: category,
    });
  } catch (err) {
    console.log(err)
    res.json({
      success: false,
      message: "Failed",
      error: err,
    });
  }
};

export const getAllCategories =async (req, res) => {
  let findCondition = {
      isActive: 1
  };

  if(req.query.countryCode && req.query.countryCode!='undefined'){
      findCondition.languageCode = req.query.countryCode.split('-')[0];
  }else if (req.query.countryId && req.query.countryId != 'undefined') {
      findCondition.countryId = req.query.countryId
  }
  let category= await getAllCategory(findCondition)
  try{
    res.json({
      success: true,
      msg: "success",
      result: category,
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

export const getCategoriesById = async (req, res) => {
  try{
    let categoryById=await getCategoryById(req.params)
    res.json({
      success: true,
      msg: "success",
      result: categoryById,
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

export const updateCategories = async (req, res) => {
  try{
    let updatecategory=await updateCategory(req.body,req.body)
    res.json({
      success: true,
      msg: "success",
      result: updatecategory,
    });

  }catch(err){
    console.log(err)
      res.json({
        success: false,
        message: "Failed",
        error: err,
      });
    };
};

export const getCategoriesByRoute = async (req, res) => {
  try{
    let findCondition = {
        route: req.params.route,
        isActive : true
    };

    if(req.query.countryCode && req.query.countryCode!='undefined'){
      findCondition.languageCode = req.query.countryCode.split('-')[0];
    }else if (req.query.countryId && req.query.countryId != 'undefined') {
        findCondition.countryId = req.query.countryId;
    }
    let categoryRoute= await getCategoryByroute(findCondition,req.query);
    if(categoryRoute.length <= 0){
      return res.json({
         success: false,
         msg: "not found",
       });
     }
     res.json({
       success: true,
       msg: "success",
       category: categoryRoute[0],
       company: categoryRoute[1],
     });
  }catch(err){
    console.log(err)
      res.json({
        success: false,
        message: "Failed",
        error: err,
      });
    };
};

export const deleteCategory = async(req, res) => {
    try {
        let makeInActive = await updateCategory(req.params, {
            isActive: false
        });
        res.json({
            success: true,
            msg: "success",
            result: makeInActive,
        });

    } catch (err) {
        console.log(err)
        res.json({
            success: false,
            message: "Failed",
            error: err,
        });
    };
};


export const contentMigration = async(req, res) => {
    let categories = await getAllCategory()
    try {
        for (let data of categories) {

            let htmlContent = '';
            for (const content of data.categoryContent) {

                if (content.key == 'paragraph' || content.key == 'normal') {

                    if (content.heading) {
                        htmlContent += `<h4>${content.heading}</h4>`;
                    }
                    htmlContent += `<p>${content.value}</p>`
                }


            }

            let letterIntro = ''
            for (const intro of data.letterIntro) {

                for (const key in intro) {

                    if (key == 'head') {
                        letterIntro += `${intro[key]}`;
                    }

                    if (key == 'dateBefore') {
                        letterIntro += ` ${intro[key]}`;
                    }

                    if (key == 'dateAfter') {
                        letterIntro += `{{Date}} ${intro[key]}`;
                        letterIntro = letterIntro.replace('per{{Date}}', ' {{Date}}');
                    }

                }
            }

            let landingPageIntro = data.landingPageIntro.join(' {{CompanyName}} ')

            let updateData = {
                categoryContent: htmlContent,
                letterIntro: letterIntro,
                landingPageIntro: landingPageIntro
            };

            if(data.categoryContent.length>1){
              await updateCategory({id:data._id},updateData);              
            }
        }

        res.json({
            success: true,
            msg: "success",
            result: {},
        });

    } catch (err) {
        console.log(err)
        res.json({
            success: false,
            message: "Failed",
            error: err,
        });
    }
};


