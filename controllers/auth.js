const { User } = require("../models/user");
const bcrypt = require("bcrypt");

const registration = async (req, res) => {
   const { email, password } = req.body;

   const salt = await bcrypt.genSalt();
   const hashedPassword = await bcrypt.hash(password, salt);
   const result = await User.create({ email, password: hashedPassword });

   res.status(201).json({
      email,
      id: result._id,
   });
};

module.exports = {
   registration,
};
