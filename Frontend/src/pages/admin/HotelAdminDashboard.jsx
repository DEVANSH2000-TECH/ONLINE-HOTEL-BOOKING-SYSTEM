import { useEffect, useState } from "react";
import api from "../../services/api";
import {
    addRoom,
    getRoomsByHotel,
    getBookings,
    getMyHotel,
} from "../../services/hotelAdminService";

const HotelAdminDashboard = () => {
    const [hotel, setHotel] = useState(null);
    const [rooms, setRooms] = useState([]);
    const [bookings, setBookings] = useState([]);

    const [roomForm, setRoomForm] = useState({
        roomType: "",
        price: "",
        maxGuests: "",
        totalRooms: "",
    });

    const [roomImages, setRoomImages] = useState({});
    const [selectedRoom, setSelectedRoom] = useState(null);

    useEffect(() => {
        const loadHotel = async () => {
            const res = await getMyHotel();
            setHotel(res.data);
        };
        loadHotel();
    }, []);

    useEffect(() => {
        if (!hotel) return;

        const loadData = async () => {
            const roomRes = await getRoomsByHotel(hotel.id);
            const bookingRes = await getBookings();

            setRooms(roomRes.data);
            setBookings(
                bookingRes.data.filter((b) => b.hotel_id === hotel.id)
            );
        };

        loadData();
    }, [hotel]);

    const handleAddRoom = async () => {
        await addRoom({ hotelId: hotel.id, ...roomForm });
        setRoomForm({
            roomType: "",
            price: "",
            maxGuests: "",
            totalRooms: "",
        });

        const roomRes = await getRoomsByHotel(hotel.id);
        setRooms(roomRes.data);
    };

    const uploadRoomImages = async (roomId) => {
        const formData = new FormData();
        Array.from(roomImages[roomId] || []).forEach((img) =>
            formData.append("images", img)
        );

        await api.post(`/room-images/${roomId}`, formData);
        alert("Room images uploaded");

        const roomRes = await getRoomsByHotel(hotel.id);
        setRooms(roomRes.data);
    };

    if (!hotel) return <p>Loading hotel...</p>;

    return (
        <div style={{ padding: "2rem" }}>
            <h2>Hotel Admin Dashboard</h2>

            <h3>Add Room</h3>
            <input
                placeholder="Room Type"
                value={roomForm.roomType}
                onChange={(e) =>
                    setRoomForm({ ...roomForm, roomType: e.target.value })
                }
            />
            <input
                placeholder="Price"
                value={roomForm.price}
                onChange={(e) =>
                    setRoomForm({ ...roomForm, price: e.target.value })
                }
            />
            <input
                placeholder="Max Guests"
                value={roomForm.maxGuests}
                onChange={(e) =>
                    setRoomForm({ ...roomForm, maxGuests: e.target.value })
                }
            />
            <input
                placeholder="Total Rooms"
                value={roomForm.totalRooms}
                onChange={(e) =>
                    setRoomForm({ ...roomForm, totalRooms: e.target.value })
                }
            />
            <button onClick={handleAddRoom}>Add Room</button>

            <hr />

            <h3>Your Rooms</h3>
            {rooms.map((room) => (
                <div key={room.id} style={{ marginBottom: "2rem" }}>
                    <strong>{room.room_type}</strong> – ₹{room.price}

                    <div>
                        <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={(e) =>
                                setRoomImages({
                                    ...roomImages,
                                    [room.id]: e.target.files,
                                })
                            }
                        />
                        <button onClick={() => uploadRoomImages(room.id)}>
                            Upload Room Images
                        </button>
                    </div>

                    <div style={{ display: "flex", gap: "10px" }}>
                        {room.images?.map((img, i) => (
                            <img
                                key={i}
                                src={`http://localhost:5000${img.image_url}`}
                                alt="Room"
                                style={{
                                    width: "80px",
                                    height: "60px",
                                    objectFit: "cover",
                                    borderRadius: "4px",
                                }}
                            />
                        ))}
                    </div>
                </div>
            ))}

            <hr />

            <h3>Bookings</h3>
            {bookings.map((b) => (
                <p key={b.id}>
                    Booking #{b.id} – {b.status}
                </p>
            ))}
        </div>
    );
};

export default HotelAdminDashboard;
