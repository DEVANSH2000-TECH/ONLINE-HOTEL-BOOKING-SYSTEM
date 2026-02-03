const db = require("../config/db");

/* ================= ADD ROOM ================= */
exports.addRoom = async (req, res) => {
    try {
        const { hotelId, roomType, price, maxGuests, totalRooms } = req.body;

        await db.query(
            `INSERT INTO rooms 
             (hotel_id, room_type, price, max_guests, total_rooms)
             VALUES (?, ?, ?, ?, ?)`,
            [hotelId, roomType, price, maxGuests, totalRooms]
        );

        res.status(201).json({ message: "Room added successfully" });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};

/* ================= GET ROOMS BY HOTEL ================= */
exports.getRoomsByHotel = async (req, res) => {
    try {
        const hotelId = req.params.hotelId;

        const [rooms] = await db.query(
            "SELECT * FROM rooms WHERE hotel_id = ?",
            [hotelId]
        );

        for (let room of rooms) {
            const [images] = await db.query(
                "SELECT image_url FROM room_images WHERE room_id = ?",
                [room.id]
            );
            room.images = images;
        }

        res.json(rooms);
    } catch (err) {
        console.error("GET ROOMS ERROR:", err);
        res.status(500).json({ message: "Server error" });
    }
};
