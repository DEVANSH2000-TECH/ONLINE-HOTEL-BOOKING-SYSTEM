const db = require("../config/db");

/* ================= GET ALL APPROVED HOTELS ================= */
exports.getHotels = async (req, res) => {
    try {
        const { city } = req.query;

        let sql = `
            SELECT h.*,
                   (
                       SELECT image_url
                       FROM hotel_images hi
                       WHERE hi.hotel_id = h.id
                       LIMIT 1
                   ) AS cover_image
            FROM hotels h
            WHERE h.status = 'approved'
        `;
        let params = [];

        if (city) {
            sql += " AND h.city = ?";
            params.push(city);
        }

        const [hotels] = await db.query(sql, params);
        res.json(hotels);
    } catch (err) {
        console.error("GET HOTELS ERROR:", err);
        res.status(500).json({ message: "Server error" });
    }
};

/* ================= SEARCH HOTELS (CITY + DATE AVAILABILITY) ================= */
/*
   Triggered when user clicks SEARCH on home page
   URL example:
   /api/hotels/search?city=patiala&checkIn=2026-01-25&checkOut=2026-01-27
*/
exports.searchHotels = async (req, res) => {
    try {
        const { city, checkIn, checkOut } = req.query;

        if (!city || !checkIn || !checkOut) {
            return res.status(400).json({ message: "Missing search parameters" });
        }

        /* 1️⃣ Get approved hotels in selected city */
        const [hotels] = await db.query(
            `
            SELECT h.*,
                   (
                       SELECT image_url
                       FROM hotel_images hi
                       WHERE hi.hotel_id = h.id
                       LIMIT 1
                   ) AS cover_image
            FROM hotels h
            WHERE h.status = 'approved'
              AND h.city = ?
            `,
            [city]
        );

        if (hotels.length === 0) {
            return res.json([]);
        }

        const availableHotels = [];

        /* 2️⃣ Check room availability for each hotel */
        for (const hotel of hotels) {
            const [rooms] = await db.query(
                `
                SELECT r.*
                FROM rooms r
                WHERE r.hotel_id = ?
                  AND r.id NOT IN (
                      SELECT b.room_id
                      FROM bookings b
                      WHERE b.check_in < ?
                        AND b.check_out > ?
                        AND b.status IN ('confirmed', 'paid')
                  )
                `,
                [hotel.id, checkOut, checkIn]
            );

            if (rooms.length > 0) {
                availableHotels.push({
                    ...hotel,
                    availableRooms: rooms.length,
                });
            }
        }

        res.json(availableHotels);
    } catch (err) {
        console.error("SEARCH HOTELS ERROR:", err);
        res.status(500).json({ message: "Server error" });
    }
};

/* ================= GET HOTEL DETAILS + ROOMS + IMAGES ================= */
exports.getHotelById = async (req, res) => {
    try {
        const hotelId = req.params.id;

        const [hotels] = await db.query(
            "SELECT * FROM hotels WHERE id = ? AND status = 'approved'",
            [hotelId]
        );

        if (hotels.length === 0) {
            return res.status(404).json({ message: "Hotel not found" });
        }

        const [rooms] = await db.query(
            "SELECT * FROM rooms WHERE hotel_id = ?",
            [hotelId]
        );

        const [images] = await db.query(
            "SELECT image_url FROM hotel_images WHERE hotel_id = ?",
            [hotelId]
        );

        res.json({
            hotel: hotels[0],
            rooms,
            images,
        });
    } catch (err) {
        console.error("HOTEL DETAILS ERROR:", err);
        res.status(500).json({ message: "Server error" });
    }
};

/* ================= HOME PAGE HERO CAROUSEL IMAGES ================= */
exports.getHomepageHotelImages = async (req, res) => {
    try {
        const [images] = await db.query(`
            SELECT 
                hi.image_url,
                h.name,
                h.city
            FROM hotel_images hi
            JOIN hotels h ON h.id = hi.hotel_id
            WHERE h.status = 'approved'
            ORDER BY hi.id DESC
            LIMIT 10
        `);

        res.json(images);
    } catch (err) {
        console.error("HOMEPAGE IMAGES ERROR:", err);
        res.status(500).json({ message: "Server error" });
    }
};


