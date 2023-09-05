const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;
const { User } = require("../models/user");

const validateToken = async (req, res, next) => {
   const { authorization = "" } = req.headers;
   const [bearer, token] = authorization.split(" ");

   if (bearer !== "Bearer") {
      return res.status(401).json({ message: "Token type isn't valid" });
   }

   if (!token) {
      return res.status(401).json({ message: "No token was provided" });
   }

   try {
      const payload = jwt.verify(token, JWT_SECRET);
      const user = await User.findById(payload.id);

      if (!user || !user.token || user.token !== token) {
         return res.status(401).json({ message: "Not authorized" });
      }

      req.user = user;
   } catch (error) {
      return res.status(401).json({ message: "Not authorized" });
   }

   next();
};

module.exports = validateToken;
