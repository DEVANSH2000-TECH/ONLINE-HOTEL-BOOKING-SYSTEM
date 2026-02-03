const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/bookingController");
const { protect } = require("../middlewares/authMiddleware");

router.use(protect);

// 🔍 Check availability
router.post("/check", bookingController.checkAvailability);

// 🏨 Create booking
router.post("/", bookingController.createBooking);

// 📄 Get bookings
router.get("/", bookingController.getAllBookings);

// ❌ Cancel booking (NEW)
router.patch("/:id/cancel", bookingController.cancelBooking);

module.exports = router;
