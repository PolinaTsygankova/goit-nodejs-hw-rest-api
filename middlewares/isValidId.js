const { isValidObjectId } = require("mongoose");

const isValidId = (req, res, next) => {
   const { contactId } = req.params;
   if (!isValidObjectId(contactId)) {
      const error = new Error(`${contactId} is not a valid id`);
      error.status = 400;
      return error;
   }
   next();
};

module.exports = isValidId;
