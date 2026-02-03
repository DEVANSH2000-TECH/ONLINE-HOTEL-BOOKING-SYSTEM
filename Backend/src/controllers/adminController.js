const db = require("../config/db");

/* ================= GET PENDING HOTEL REGISTRATIONS (ADMIN) ================= */
exports.getPendingHotelRegistrations = async (req, res) => {
    try {
        const [rows] = await db.query(
            "SELECT * FROM hotel_registrations WHERE status = 'pending'"
        );
        res.json(rows);
    } catch (err) {
        console.error("GET REGISTRATIONS ERROR:", err);
        res.status(500).json({ message: "Server error" });
    }
};

/* ================= APPROVE HOTEL REGISTRATION (ADMIN) ================= */
exports.approveHotelRegistration = async (req, res) => {
    const connection = await db.getConnection();

    try {
        const { registrationId } = req.body;

        if (!registrationId) {
            return res.status(400).json({ message: "registrationId required" });
        }

        await connection.beginTransaction();

        // 1. Get pending registration
        const [[registration]] = await connection.query(
            "SELECT * FROM hotel_registrations WHERE id = ? AND status = 'pending'",
            [registrationId]
        );

        if (!registration) {
            await connection.rollback();
            return res.status(404).json({ message: "Registration not found" });
        }

        // 2. Create hotel
        const [hotelResult] = await connection.query(
            `INSERT INTO hotels (name, city, address, description, status)
             VALUES (?, ?, NULL, 'Approved hotel', 'approved')`,
            [registration.hotel_name, registration.city]
        );

        const hotelId = hotelResult.insertId;

        // 3. User must already exist
        const [[user]] = await connection.query(
            "SELECT id FROM users WHERE email = ?",
            [registration.email]
        );

        if (!user) {
            await connection.rollback();
            return res.status(400).json({
                message: "Hotel owner must register as a user first",
            });
        }

        // 4. Promote user to hotel_admin
        await connection.query(
            "UPDATE users SET role = 'hotel_admin' WHERE id = ?",
            [user.id]
        );

        // 5. Map hotel_admin to hotel
        await connection.query(
            "INSERT INTO hotel_admins (user_id, hotel_id) VALUES (?, ?)",
            [user.id, hotelId]
        );

        // 6. Update registration status
        await connection.query(
            "UPDATE hotel_registrations SET status = 'approved' WHERE id = ?",
            [registrationId]
        );

        await connection.commit();

        res.json({ message: "Hotel approved successfully" });
    } catch (err) {
        await connection.rollback();
        console.error("APPROVE HOTEL ERROR:", err);
        res.status(500).json({ message: "Server error" });
    } finally {
        connection.release();
    }
};

/* ================= GET MY HOTEL (HOTEL ADMIN) ================= */
exports.getMyHotel = async (req, res) => {
    try {
        const userId = req.user.id; // injected by protect middleware

        const [rows] = await db.query(
            `
            SELECT h.*
            FROM hotels h
            JOIN hotel_admins ha ON h.id = ha.hotel_id
            WHERE ha.user_id = ?
            `,
            [userId]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                message: "No hotel mapped to this hotel admin",
            });
        }

        res.json(rows[0]);
    } catch (err) {
        console.error("GET MY HOTEL ERROR:", err);
        res.status(500).json({ message: "Server error" });
    }
};
