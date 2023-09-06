const express = require("express");
const {
   registration,
   login,
   getCurrent,
   logout,
   updateAvatar,
} = require("../../controllers/auth");
const validateToken = require("../../middlewares/validateToken");
const { upload } = require("../../middlewares/upload");
const router = express.Router();

router.post("/register", registration);

router.post("/login", login);

router.get("/current", validateToken, getCurrent);

router.post("/logout", validateToken, logout);

router.patch("/avatars", validateToken, upload.single("avatar"), updateAvatar);

module.exports = router;
