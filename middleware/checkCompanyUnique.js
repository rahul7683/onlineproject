import companymodel from "../Modal/CompanyModal.js";
export const checkCompanyUnique= (req, res, next) => {
    companymodel
        .find({ companyName: req.body.companyName, countryId:req.body.countryId })
        .exec()
        .then((response) => {
          if (response.length > 0) {
            return res.json({
              success: false,
              message: "company already exist",
            });
          }
          next();
        })
        .catch((err) => {
          return err;
        });
}