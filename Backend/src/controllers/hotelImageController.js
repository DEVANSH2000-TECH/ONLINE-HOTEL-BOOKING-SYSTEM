const db = require("../config/db");

exports.addHotelImages = async (req, res) => {
    try {
        const hotelId = req.params.hotelId;

        const images = req.files.map((file) => [
            hotelId,
            `/uploads/${file.filename}`,
        ]);

        await db.query(
            "INSERT INTO hotel_images (hotel_id, image_url) VALUES ?",
            [images]
        );

        res.json({ message: "Images uploaded successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Upload failed" });
    }
};
