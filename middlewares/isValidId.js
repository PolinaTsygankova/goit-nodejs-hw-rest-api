const { isValidObjectId } = require("mongoose");

const isValidId = (req, res, next) => {
   const { id } = req.params;
   if (!isValidObjectId(id)) {
      const error = new Error(`${id} is not a valid id`);
      error.status = 400;
      return error;
   }
   next();
};

module.exports = isValidId;
