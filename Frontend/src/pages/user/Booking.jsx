import { useLocation, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { BookingContext } from "../../context/BookingContext";
import useAuth from "../../hooks/useAuth";
import { createBooking } from "../../services/bookingService";

const Booking = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { setBookingData } = useContext(BookingContext);

    const [checkIn, setCheckIn] = useState("");
    const [checkOut, setCheckOut] = useState("");
    const [error, setError] = useState("");

    if (!state) return <p>Invalid booking request</p>;

    const { hotelId, roomId, price } = state;

    const handleBooking = async () => {
        if (!checkIn || !checkOut) {
            setError("Please select dates");
            return;
        }

        try {
            const res = await createBooking({
                userId: user.id,
                hotelId,
                roomId,
                checkIn,
                checkOut,
            });

            setBookingData({
                bookingId: res.data.bookingId,
                amount: price,
            });

            navigate("/payment");
        } catch (err) {
            setError(err.response?.data?.message || "Booking failed");
        }
    };

    return (
        <div style={{ maxWidth: "600px", margin: "2rem auto" }}>
            <h2>Confirm Booking</h2>

            {error && <p style={{ color: "red" }}>{error}</p>}

            <label>Check In</label>
            <input type="date" onChange={(e) => setCheckIn(e.target.value)} />

            <label>Check Out</label>
            <input type="date" onChange={(e) => setCheckOut(e.target.value)} />

            <p style={{ marginTop: "1rem" }}>
                Price per night: ₹{price}
            </p>

            <button
                style={{
                    marginTop: "1rem",
                    padding: "0.6rem 1rem",
                    background: "#2563eb",
                    color: "#fff",
                    borderRadius: "8px",
                }}
                onClick={handleBooking}
            >
                Proceed to Payment
            </button>
        </div>
    );
};

export default Booking;
