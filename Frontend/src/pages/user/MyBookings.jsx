import { useEffect, useState } from "react";
import {
    getMyBookings,
    cancelBooking,
} from "../../services/bookingService";
import Loaders from "../../components/common/Loaders";

const MyBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchBookings = async () => {
        try {
            const data = await getMyBookings();
            setBookings(data);
        } catch (err) {
            console.error("Failed to load bookings", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    const handleCancel = async (id) => {
        const confirmCancel = window.confirm(
            "Are you sure you want to cancel this booking?"
        );
        if (!confirmCancel) return;

        try {
            await cancelBooking(id);
            fetchBookings(); // refresh list
        } catch (err) {
            alert(
                err.response?.data?.message ||
                "Failed to cancel booking"
            );
        }
    };

    if (loading) return <Loaders text="Loading your bookings..." />;

    return (
        <div style={{ maxWidth: "900px", margin: "2rem auto" }}>
            <h2>My Bookings</h2>

            {bookings.length === 0 && (
                <p>You have no bookings yet.</p>
            )}

            {bookings.map((b) => (
                <div
                    key={b.id}
                    style={{
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px",
                        padding: "1rem",
                        marginBottom: "1rem",
                    }}
                >
                    <h4>{b.hotel_name || "Hotel"}</h4>

                    <p>
                        {b.check_in} → {b.check_out}
                    </p>

                    <p>
                        Status:{" "}
                        <strong
                            style={{
                                color:
                                    b.status === "cancelled"
                                        ? "#dc2626"
                                        : "#16a34a",
                            }}
                        >
                            {b.status}
                        </strong>
                    </p>

                    {/* ❌ CANCEL BUTTON */}
                    {b.status === "confirmed" && (
                        <button
                            onClick={() => handleCancel(b.id)}
                            style={{
                                marginTop: "0.5rem",
                                padding: "8px 14px",
                                background: "#dc2626",
                                color: "#fff",
                                border: "none",
                                borderRadius: "6px",
                                cursor: "pointer",
                            }}
                        >
                            Cancel Booking
                        </button>
                    )}
                </div>
            ))}
        </div>
    );
};

export default MyBookings;
