const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const { protect, restrictTo } = require("../middlewares/authMiddleware");

/* ADMIN ONLY */
router.use(protect);
router.use(restrictTo("admin"));

router.get("/hotel-registrations", adminController.getPendingHotelRegistrations);
router.post("/approve-hotel", adminController.approveHotelRegistration);

module.exports = router;
