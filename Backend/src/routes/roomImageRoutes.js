const express = require("express");
const router = express.Router();
const upload = require("../middlewares/uploadMiddleware");
const controller = require("../controllers/roomImageController");
const { protect, restrictTo } = require("../middlewares/authMiddleware");

router.post(
    "/:roomId",
    protect,
    restrictTo("hotel_admin"),
    upload.array("images", 5),
    controller.addRoomImages
);

module.exports = router;
