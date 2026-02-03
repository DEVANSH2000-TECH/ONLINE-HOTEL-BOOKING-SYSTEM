const db = require("../config/db");

/* ================= CHECK ROOM AVAILABILITY ================= */
exports.checkAvailability = async (req, res) => {
    try {
        const { roomId, checkIn, checkOut } = req.body;

        if (!roomId || !checkIn || !checkOut) {
            return res.status(400).json({ message: "Missing fields" });
        }

        const [conflicts] = await db.query(
            `
            SELECT id
            FROM bookings
            WHERE room_id = ?
              AND status IN ('pending', 'confirmed')
              AND check_in < ?
              AND check_out > ?
            `,
            [roomId, checkOut, checkIn]
        );

        res.json({ available: conflicts.length === 0 });
    } catch (err) {
        console.error("CHECK AVAILABILITY ERROR:", err);
        res.status(500).json({ message: "Server error" });
    }
};

/* ================= CREATE BOOKING ================= */
exports.createBooking = async (req, res) => {
    const conn = await db.getConnection();

    try {
        const userId = req.user.id;
        const { hotelId, roomId, checkIn, checkOut } = req.body;

        if (!hotelId || !roomId || !checkIn || !checkOut) {
            return res.status(400).json({ message: "All fields required" });
        }

        await conn.beginTransaction();

        const [conflicts] = await conn.query(
            `
            SELECT id
            FROM bookings
            WHERE room_id = ?
              AND status IN ('pending', 'confirmed')
              AND check_in < ?
              AND check_out > ?
            FOR UPDATE
            `,
            [roomId, checkOut, checkIn]
        );

        if (conflicts.length > 0) {
            await conn.rollback();
            return res.status(409).json({ message: "Room not available" });
        }

        const [result] = await conn.query(
            `
            INSERT INTO bookings 
            (user_id, hotel_id, room_id, check_in, check_out, status)
            VALUES (?, ?, ?, ?, ?, 'pending')
            `,
            [userId, hotelId, roomId, checkIn, checkOut]
        );

        await conn.commit();

        res.status(201).json({
            message: "Booking created",
            bookingId: result.insertId,
        });
    } catch (err) {
        await conn.rollback();
        console.error("CREATE BOOKING ERROR:", err);
        res.status(500).json({ message: "Server error" });
    } finally {
        conn.release();
    }
};

/* ================= GET BOOKINGS (ROLE BASED) ================= */
exports.getAllBookings = async (req, res) => {
    try {
        const { role, id } = req.user;

        let sql;
        let params = [];

        if (role === "admin") {
            sql = `
                SELECT b.*, u.full_name, h.name AS hotel_name
                FROM bookings b
                JOIN users u ON b.user_id = u.id
                JOIN hotels h ON b.hotel_id = h.id
            `;
        } else if (role === "hotel_admin") {
            sql = `
                SELECT b.*
                FROM bookings b
                JOIN hotel_admins ha ON b.hotel_id = ha.hotel_id
                WHERE ha.user_id = ?
            `;
            params = [id];
        } else {
            sql = `
                SELECT *
                FROM bookings
                WHERE user_id = ?
            `;
            params = [id];
        }

        const [rows] = await db.query(sql, params);
        res.json(rows);
    } catch (err) {
        console.error("GET BOOKINGS ERROR:", err);
        res.status(500).json({ message: "Server error" });
    }
};

/* ================= CANCEL BOOKING (NEW) ================= */
exports.cancelBooking = async (req, res) => {
    try {
        const bookingId = req.params.id;
        const { id: userId, role } = req.user;

        if (role !== "user") {
            return res.status(403).json({ message: "Unauthorized" });
        }

        const [rows] = await db.query(
            `
            SELECT status
            FROM bookings
            WHERE id = ? AND user_id = ?
            `,
            [bookingId, userId]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: "Booking not found" });
        }

        if (rows[0].status === "cancelled") {
            return res
                .status(400)
                .json({ message: "Booking already cancelled" });
        }

        await db.query(
            `
            UPDATE bookings
            SET status = 'cancelled'
            WHERE id = ?
            `,
            [bookingId]
        );

        res.json({ message: "Booking cancelled successfully" });
    } catch (err) {
        console.error("CANCEL BOOKING ERROR:", err);
        res.status(500).json({ message: "Server error" });
    }
};


