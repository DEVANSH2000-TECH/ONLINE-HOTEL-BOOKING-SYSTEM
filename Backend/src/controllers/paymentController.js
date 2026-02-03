const db = require("../config/db");

/* ================= INITIATE PAYMENT ================= */
/*
FLOW:
1. Validate input
2. Ensure booking exists
3. Create payment record
4. Update booking status → confirmed
*/
exports.initiatePayment = async (req, res) => {
    const connection = await db.getConnection();

    try {
        const { bookingId, amount } = req.body;

        if (!bookingId || !amount) {
            return res.status(400).json({
                message: "Booking ID and amount are required",
            });
        }

        // 🔒 Start transaction
        await connection.beginTransaction();

        /* ================= CHECK BOOKING ================= */
        const [bookingRows] = await connection.query(
            "SELECT id, status FROM bookings WHERE id = ?",
            [bookingId]
        );

        if (bookingRows.length === 0) {
            await connection.rollback();
            return res.status(404).json({ message: "Booking not found" });
        }

        if (bookingRows[0].status === "confirmed") {
            await connection.rollback();
            return res
                .status(400)
                .json({ message: "Booking already confirmed" });
        }

        /* ================= INSERT PAYMENT ================= */
        const [paymentResult] = await connection.query(
            `
            INSERT INTO payments (booking_id, amount, status)
            VALUES (?, ?, 'success')
            `,
            [bookingId, amount]
        );

        /* ================= UPDATE BOOKING ================= */
        await connection.query(
            `
            UPDATE bookings
            SET status = 'confirmed'
            WHERE id = ?
            `,
            [bookingId]
        );

        // ✅ Commit transaction
        await connection.commit();

        res.status(201).json({
            message: "Payment successful",
            paymentId: paymentResult.insertId,
        });
    } catch (err) {
        await connection.rollback();
        console.error("PAYMENT ERROR:", err);

        res.status(500).json({
            message: "Payment failed. Please try again.",
        });
    } finally {
        connection.release();
    }
};

