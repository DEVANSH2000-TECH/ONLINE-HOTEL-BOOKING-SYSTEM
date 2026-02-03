const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const { protect, restrictTo } = require("../middlewares/authMiddleware");

/* HOTEL ADMIN ONLY */
router.use(protect);
router.use(restrictTo("hotel_admin"));

router.get("/my-hotel", adminController.getMyHotel);

module.exports = router;
