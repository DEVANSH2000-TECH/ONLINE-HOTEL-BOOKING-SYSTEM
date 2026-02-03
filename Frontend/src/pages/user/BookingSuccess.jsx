import { useLocation, Link } from "react-router-dom";

const BookingSuccess = () => {
    const { state } = useLocation();

    if (!state) return null;

    return (
        <div style={{ textAlign: "center", marginTop: "3rem" }}>
            <h2>🎉 Booking Confirmed!</h2>

            <p>
                Your booking at <strong>{state.hotel.name}</strong> is confirmed.
            </p>

            <p>
                Room: {state.room.room_type}
            </p>

            <p>
                Amount Paid: ₹{state.amount}
            </p>

            <Link to="/my-bookings">View My Bookings</Link>
        </div>
    );
};

export default BookingSuccess;
