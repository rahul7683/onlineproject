import categorymodel from "../Modal/CategoryModal.js";
export const checkCatUnique= (req, res, next) => {
    categorymodel
        .find({ categoryName: req.body.categoryName, countryId : req.body.countryId })
        .exec()
        .then((response) => {
          if (response.length > 0) {
            return res.json({
              success: false,
              message: "category already exist",
            });
          }
          next();
        })
        .catch((err) => {
          return err;
        });
}