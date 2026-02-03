import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const RoomCard = ({ room, hotelId, onBook }) => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const image =
        room.images?.length > 0
            ? `http://localhost:5000${room.images[0].image_url}`
            : "/assets/images/room-placeholder.jpg";

    const handleBookNow = () => {
        if (!user) {
            navigate(`/login?redirect=/hotels/${hotelId}`);
            return;
        }
        onBook(room);
    };

    return (
        <div
            className="room-card"
            style={{
                display: "flex",
                gap: "1rem",
                padding: "1rem",
                border: "1px solid #e5e7eb",
                borderRadius: "10px",
                alignItems: "center",
                background: "#fff",
            }}
        >
            {/* IMAGE */}
            <img
                src={image}
                alt={room.room_type}
                style={{
                    width: "220px",
                    height: "140px",
                    objectFit: "cover",
                    borderRadius: "8px",
                    flexShrink: 0,
                }}
            />

            {/* ROOM INFO */}
            <div style={{ flex: 1 }}>
                <h4 style={{ margin: "0 0 6px 0" }}>{room.room_type}</h4>
                <p style={{ margin: "0", fontWeight: 600 }}>
                    ₹{room.price} / night
                </p>
                <p style={{ margin: "4px 0", color: "#6b7280" }}>
                    Max Guests: {room.max_guests}
                </p>
            </div>

            {/* BOOK BUTTON */}
            <button
                onClick={handleBookNow}
                style={{
                    padding: "10px 20px",
                    background: "#2563eb",
                    color: "#fff",
                    border: "none",
                    borderRadius: "8px",
                    fontWeight: 600,
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                }}
            >
                Book Now
            </button>
        </div>
    );
};

export default RoomCard;

