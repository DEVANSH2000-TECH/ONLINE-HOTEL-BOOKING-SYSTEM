const db = require("../config/db");

/* ================= REGISTER HOTEL ================= */
exports.registerHotel = async (req, res) => {
    try {
        const { hotelName, ownerName, email, phone, city } = req.body;

        if (!hotelName || !ownerName || !email || !phone || !city) {
            return res.status(400).json({ message: "All fields are required" });
        }

        await db.query(
            `INSERT INTO hotel_registrations 
       (hotel_name, owner_name, email, phone, city)
       VALUES (?, ?, ?, ?, ?)`,
            [hotelName, ownerName, email, phone, city]
        );

        res.status(201).json({
            message: "Hotel registration submitted. Awaiting approval."
        });
    } catch (err) {
        console.error("HOTEL REG ERROR:", err);
        res.status(500).json({ message: "Server error" });
    }
};
