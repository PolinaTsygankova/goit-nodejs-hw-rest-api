const express = require("express");
const {
   registration,
   login,
   getCurrent,
   logout,
} = require("../../controllers/auth");
const validateToken = require("../../middlewares/validateToken");
const router = express.Router();

router.post("/register", registration);

router.post("/login", login);

router.get("/current", validateToken, getCurrent);

router.post("/logout", validateToken, logout);

module.exports = router;
