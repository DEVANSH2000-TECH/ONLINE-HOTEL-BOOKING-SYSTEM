const express = require("express");
const router = express.Router();
const controller = require("../controllers/hotelRegistrationController");

router.post("/", controller.registerHotel);

module.exports = router;
