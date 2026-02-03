const express = require("express");
const router = express.Router();
const upload = require("../middlewares/uploadMiddleware");
const controller = require("../controllers/hotelImageController");
const { protect, restrictTo } = require("../middlewares/authMiddleware");

router.post(
    "/:hotelId",
    protect,
    restrictTo("hotel_admin"),
    upload.array("images", 5),
    controller.addHotelImages
);

module.exports = router;