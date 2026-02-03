const db = require("../config/db");

/* ================= ADD REVIEW ================= */
exports.addReview = async (req, res) => {
    try {
        const userId = req.user.id;
        const { hotelId, rating, comment } = req.body;

        if (!hotelId || !rating) {
            return res.status(400).json({ message: "Hotel and rating required" });
        }

        // 1. Check confirmed booking
        const [[booking]] = await db.query(
            `
            SELECT id FROM bookings
            WHERE user_id = ? AND hotel_id = ? AND status = 'confirmed'
            `,
            [userId, hotelId]
        );

        if (!booking) {
            return res.status(403).json({
                message: "You can only review hotels you have booked",
            });
        }

        // 2. Prevent duplicate review
        const [[existing]] = await db.query(
            `
            SELECT id FROM reviews
            WHERE user_id = ? AND hotel_id = ?
            `,
            [userId, hotelId]
        );

        if (existing) {
            return res.status(400).json({
                message: "You have already reviewed this hotel",
            });
        }

        // 3. Insert review
        await db.query(
            `
            INSERT INTO reviews (user_id, hotel_id, rating, comment)
            VALUES (?, ?, ?, ?)
            `,
            [userId, hotelId, rating, comment || null]
        );

        res.status(201).json({ message: "Review added successfully" });
    } catch (err) {
        console.error("ADD REVIEW ERROR:", err);
        res.status(500).json({ message: "Server error" });
    }
};

/* ================= GET REVIEWS BY HOTEL ================= */
exports.getHotelReviews = async (req, res) => {
    try {
        const hotelId = req.params.hotelId;

        const [reviews] = await db.query(
            `
            SELECT r.rating, r.comment, r.created_at, u.full_name
            FROM reviews r
            JOIN users u ON r.user_id = u.id
            WHERE r.hotel_id = ?
            ORDER BY r.created_at DESC
            `,
            [hotelId]
        );

        res.json(reviews);
    } catch (err) {
        console.error("GET REVIEWS ERROR:", err);
        res.status(500).json({ message: "Server error" });
    }
};

/* ================= GET HOTEL RATING SUMMARY ================= */
exports.getHotelRatingSummary = async (req, res) => {
    try {
        const hotelId = req.params.hotelId;

        const [[summary]] = await db.query(
            `
            SELECT 
                COUNT(*) AS totalReviews,
                AVG(rating) AS avgRating
            FROM reviews
            WHERE hotel_id = ?
            `,
            [hotelId]
        );

        res.json({
            totalReviews: summary.totalReviews,
            avgRating: summary.avgRating
                ? Number(summary.avgRating).toFixed(1)
                : "0.0",
        });
    } catch (err) {
        console.error("RATING SUMMARY ERROR:", err);
        res.status(500).json({ message: "Server error" });
    }
};
