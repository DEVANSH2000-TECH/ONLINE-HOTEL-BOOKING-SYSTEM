const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");
const { protect } = require("../middlewares/authMiddleware");

router.post("/", protect, reviewController.addReview);
router.get("/hotel/:hotelId", reviewController.getHotelReviews);
router.get("/hotel/:hotelId/summary", reviewController.getHotelRatingSummary);

module.exports = router;
