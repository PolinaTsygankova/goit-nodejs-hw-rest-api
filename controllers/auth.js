const path = require("path");
const fs = require("fs/promises");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Jimp = require("jimp");
const gravatar = require("gravatar");
const { nanoid } = require("nanoid");
const { User } = require("../models/user");
const sendEmail = require("../helpers/sendEmail");
const { JWT_SECRET } = process.env;

const avatarsPath = path.join(__dirname, "../", "public", "avatars");

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
      const avatarURL = gravatar.url(email);
      const verifyToken = nanoid();

      await sendEmail({
         to: email,
         subject: "Confirm your email, please",
         html: `<a href="localhost:3000/api/auth/verify/${verifyToken}">Confirm your email</a>`,
      });

      const result = await User.create({
         email,
         password: hashedPassword,
         avatarURL,
         verifyToken,
      });

      res.status(201).json({
         user: {
            email,
            id: result._id,
         },
      });
   } catch (error) {
      console.log(error);
      if (error.name === "ValidationError") {
         return res.status(400).json({ message: "Not valid data" });
      }
      return res.status(500).json({ message: "Internal server error" });
   }
};

const verifyEmail = async (req, res) => {
   try {
      const { token } = req.params;

      const user = User.find({ verificationToken: token });

      if (!user) {
         return res.status(404).json({ message: "User not found" });
      }

      await User.findByIdAndUpdate(user._id, {
         verify: true,
         verificationToken: null,
      });

      return res.status(200).json({ message: "Verification successful" });
   } catch (error) {
      return res.status(400).json({ message: "Failed verification" });
   }
};

const resendVerifyEmail = async (req, res) => {
   const { email } = req.body;
   const user = await User.findOne({ email });

   if (!email) {
      return res.status(400).json({ message: "Missing required field email" });
   }

   if (!user) {
      return res.status(404).json({ message: "Email not found" });
   }

   if (user.verify) {
      return res
         .status(400)
         .json({ message: "Verification has already been passed" });
   }

   await sendEmail({
      to: email,
      subject: "Verify email",
      html: `<a target="_blank" href="localhost:3000/api/auth/verify/${user.verificationToken}">Retry confirming your email</a>`,
   });

   res.status(200).json({
      message: "Verification email sent", 
   });
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

const updateAvatar = async (req, res) => {
   try {
      const { _id } = req.user;
      const { path: tempUpload, originalname } = req.file;
      const filename = `${_id}_${originalname}`;
      const resultUpload = path.join(avatarsPath, filename);

      await fs.rename(tempUpload, resultUpload);
      const avatarURL = path.join("avatars", filename);
      console.log(avatarURL);

      const image = await Jimp.read(resultUpload);
      image.resize(250, 250);
      image.write(resultUpload);

      await User.findByIdAndUpdate(_id, { avatarURL });

      return res.status(200).json({ avatarURL });
   } catch (error) {
      return res.status(401).json({ message: "Not authorized" });
   }
};

module.exports = {
   registration,
   login,
   getCurrent,
   logout,
   updateAvatar,
   verifyEmail,
   resendVerifyEmail,
};
