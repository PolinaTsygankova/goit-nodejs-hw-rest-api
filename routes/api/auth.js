const express = require("express");
const {
   registration,
   login,
   getCurrent,
   logout,
   updateAvatar,
   verifyEmail,
   resendVerifyEmail,
} = require("../../controllers/auth");
const validateToken = require("../../middlewares/validateToken");
const { upload } = require("../../middlewares/upload");
const router = express.Router();

router.post("/register", registration);

router.post("/login", login);

router.get("/current", validateToken, getCurrent);

router.post("/logout", validateToken, logout);

router.patch("/avatars", validateToken, upload.single("avatar"), updateAvatar);

router.get("/verify/:token", verifyEmail);

router.post("/verify", resendVerifyEmail);

module.exports = router;
