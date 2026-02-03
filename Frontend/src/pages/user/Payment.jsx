import { useLocation, useNavigate } from "react-router-dom";
import { createBooking } from "../../services/bookingService";
import { createPayment } from "../../services/paymentService";
import useAuth from "../../hooks/useAuth";

const Payment = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const { user } = useAuth();

    if (!state || !user) {
        return <p style={{ textAlign: "center" }}>Invalid access</p>;
    }

    const { hotel, room, booking } = state;

    const nights =
        (new Date(booking.checkOut) - new Date(booking.checkIn)) /
        (1000 * 60 * 60 * 24);

    const totalAmount = nights * Number(room.price);

    const handlePayment = async () => {
        try {
            // 1️⃣ Create booking
            const bookingRes = await createBooking({
                hotelId: hotel.id,
                roomId: room.id,
                checkIn: booking.checkIn,
                checkOut: booking.checkOut,
            });

            // 2️⃣ Create payment (mock success)
            await createPayment({
                bookingId: bookingRes.bookingId,
                amount: totalAmount,
            });

            // 3️⃣ Redirect to success page
            navigate("/booking-success", {
                state: {
                    hotel,
                    room,
                    booking,
                    amount: totalAmount,
                },
            });
        } catch (err) {
            alert(
                err.response?.data?.message ||
                "Payment failed. Please try again."
            );
        }
    };

    return (
        <div style={{ maxWidth: "600px", margin: "2rem auto" }}>
            <h2>Confirm & Pay</h2>

            <div style={card}>
                <h3>{hotel.name}</h3>
                <p>{room.room_type}</p>

                <p>
                    Check-in: <strong>{booking.checkIn}</strong>
                </p>
                <p>
                    Check-out: <strong>{booking.checkOut}</strong>
                </p>

                <p>
                    Nights: <strong>{nights}</strong>
                </p>

                <p style={{ fontSize: "1.2rem", fontWeight: 600 }}>
                    Total Amount: ₹{totalAmount}
                </p>

                <button onClick={handlePayment} style={payBtn}>
                    Pay Now
                </button>
            </div>
        </div>
    );
};

const card = {
    padding: "1.5rem",
    border: "1px solid #e5e7eb",
    borderRadius: "10px",
    marginTop: "1rem",
};

const payBtn = {
    marginTop: "1rem",
    padding: "12px",
    width: "100%",
    background: "#16a34a",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontWeight: 600,
    cursor: "pointer",
};

export default Payment;
