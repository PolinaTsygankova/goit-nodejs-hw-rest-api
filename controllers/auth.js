const { User } = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;

const registration = async (req, res) => {
   try {
      const { email, password } = req.body;

      const existingUser = await User.findOne({ email });
      if (existingUser) {
         return res
            .status(409)
            .json({ message: "This email is already in use!" });
      }

      const saltRounds = 10;
      const salt = await bcrypt.genSalt(saltRounds);
      const hashedPassword = await bcrypt.hash(password, salt);
      const result = await User.create({ email, password: hashedPassword });

      res.status(201).json({
         user: {
            email,
            id: result._id,
         },
      });
   } catch (error) {
      if (error.name === "ValidationError") {
         return res.status(400).json({ message: "Not valid data" });
      }
      return res.status(500).json({ message: "Internal server error" });
   }
};

const login = async (req, res) => {
   try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!user) {
         return res.status(401).json({ message: "Email or password is wrong" });
      }

      if (!isPasswordValid) {
         return res.status(401).json({ message: "Email or password is wrong" });
      }

      const token = jwt.sign({ id: user.id }, JWT_SECRET, {
         expiresIn: "23h",
      });
      await User.findByIdAndUpdate(user._id, { token });

      return res.status(200).json({ token });
   } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
   }
};

const getCurrent = async (req, res) => {
   try {
      const { email, name } = req.user;
      return res.status(200).json({ email, name });
   } catch (error) {
      return res.status(401).json({ message: "Not authorized" });
   }
};

const logout = async (req, res) => {
   try {
      const { _id } = req.user;
      await User.findByIdAndUpdate(_id, { token: "" });

      return res.status(204).json({ message: "No Content" });
   } catch (error) {
      return res.status(401).json({ message: "Not authorized" });
   }
};

module.exports = {
   registration,
   login,
   getCurrent,
   logout,
};
