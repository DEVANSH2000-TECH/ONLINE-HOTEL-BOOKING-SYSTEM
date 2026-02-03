const express = require("express");
const router = express.Router();
const hotelController = require("../controllers/hotelController");

router.get("/homepage/images", hotelController.getHomepageHotelImages);
router.get("/search", hotelController.searchHotels);

router.get("/", hotelController.getHotels);
router.get("/:id", hotelController.getHotelById);

module.exports = router;
