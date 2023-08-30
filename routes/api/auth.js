const express = require("express");
// const { schemas } = require("../../models/contacts");
const { registration } = require("../../controllers/auth");
const router = express.Router();

router.post("/", registration);

module.exports = router;
