const express = require("express");
const router = express.Router();
const roomController = require("../controllers/roomController");
const { protect, restrictTo } = require("../middlewares/authMiddleware");

router.post(
    "/",
    protect,
    restrictTo("hotel_admin"),
    roomController.addRoom
);

router.get("/hotel/:hotelId", roomController.getRoomsByHotel);

module.exports = router;
