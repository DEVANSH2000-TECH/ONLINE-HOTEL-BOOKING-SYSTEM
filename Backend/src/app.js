const express = require("express");
const cors = require("cors");
require("dotenv").config();

/* ROUTE IMPORTS */
const authRoutes = require("./routes/authRoutes");
const hotelRegistrationRoutes = require("./routes/hotelRegistrationRoutes");
const adminRoutes = require("./routes/adminRoutes");
const hotelRoutes = require("./routes/hotelRoutes");
const roomRoutes = require("./routes/roomRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const reviewRoutes = require("./routes/reviewRoutes"); // ✅ NEW
const hotelImageRoutes = require("./routes/hotelImageRoutes");
const roomImageRoutes = require("./routes/roomImageRoutes");
const hotelAdminRoutes = require("./routes/hotelAdminRoutes");

/* APP INIT */
const app = express();

/* MIDDLEWARE */
app.use(cors());
app.use(express.json());

app.use("/uploads", express.static("uploads")); // ⭐ IMAGE ACCESS

/* ROUTES */
app.use("/api/auth", authRoutes);
app.use("/api/hotel-registration", hotelRegistrationRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/hotels", hotelRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/reviews", reviewRoutes); // ✅ NEW
app.use("/api/hotel-images", hotelImageRoutes);
app.use("/api/room-images", roomImageRoutes);
app.use("/api/hotel-admin", hotelAdminRoutes);
/* TEST ROUTE */
app.get("/", (req, res) => {
    res.send("Hotel Booking Backend Running");
});

module.exports = app;




