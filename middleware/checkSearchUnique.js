import searchmodel from "../Modal/searchModal.js";
export const checkSearchUnique= (req, res, next) => {
    searchmodel
        .find({ companyId: req.body.companyId })
        .exec()
        .then((response) => {
          console.log(response.length);
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