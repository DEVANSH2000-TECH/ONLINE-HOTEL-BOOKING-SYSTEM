const db = require("../config/db");

exports.addRoomImages = async (req, res) => {
    try {
        const roomId = req.params.roomId;

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: "No images uploaded" });
        }

        const images = req.files.map((file) => [
            roomId,
            `/uploads/${file.filename}`,
        ]);

        await db.query(
            "INSERT INTO room_images (room_id, image_url) VALUES ?",
            [images]
        );

        res.json({ message: "Room images uploaded successfully" });
    } catch (err) {
        console.error("ROOM IMAGE UPLOAD ERROR:", err);
        res.status(500).json({ message: "Upload failed" });
    }
};
