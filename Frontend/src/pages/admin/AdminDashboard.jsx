import { useEffect, useState } from "react";
import {
    getPendingHotelRegistrations,
    approveHotelRegistration,
    getAllBookings,
} from "../../services/adminService";

const AdminDashboard = () => {
    const [registrations, setRegistrations] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const regRes = await getPendingHotelRegistrations();
            const bookRes = await getAllBookings();

            setRegistrations(regRes.data);
            setBookings(bookRes.data);
        } catch (err) {
            console.error("Admin data fetch failed");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleApprove = async (registrationId) => {
        try {
            await approveHotelRegistration({
                registrationId,
                adminUserId: 1, // TEMP (will fix later via token)
            });

            setRegistrations((prev) =>
                prev.filter((r) => r.id !== registrationId)
            );
        } catch (err) {
            alert("Approval failed");
        }
    };

    if (loading) return <p style={{ padding: "2rem" }}>Loading admin data...</p>;

    return (
        <div style={{ padding: "2rem" }}>
            <h2>Admin Dashboard</h2>

            {/* HOTEL REGISTRATIONS */}
            <section style={{ marginTop: "2rem" }}>
                <h3>Pending Hotel Registrations</h3>

                {registrations.length === 0 && <p>No pending registrations</p>}

                {registrations.map((reg) => (
                    <div
                        key={reg.id}
                        style={{
                            border: "1px solid #e5e7eb",
                            padding: "1rem",
                            marginBottom: "1rem",
                            borderRadius: "8px",
                        }}
                    >
                        <p><b>Hotel:</b> {reg.hotel_name}</p>
                        <p><b>Owner:</b> {reg.owner_name}</p>
                        <p><b>Email:</b> {reg.email}</p>
                        <p><b>City:</b> {reg.city}</p>

                        <button
                            onClick={() => handleApprove(reg.id)}
                            style={{
                                marginTop: "0.5rem",
                                padding: "0.4rem 0.8rem",
                                background: "#16a34a",
                                color: "#fff",
                                borderRadius: "6px",
                            }}
                        >
                            Approve
                        </button>
                    </div>
                ))}
            </section>

            {/* BOOKINGS */}
            <section style={{ marginTop: "3rem" }}>
                <h3>All Bookings</h3>

                {bookings.length === 0 && <p>No bookings found</p>}

                <table
                    border="1"
                    cellPadding="8"
                    style={{ marginTop: "1rem", width: "100%" }}
                >
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>User</th>
                            <th>Hotel</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bookings.map((b) => (
                            <tr key={b.id}>
                                <td>{b.id}</td>
                                <td>{b.full_name}</td>
                                <td>{b.hotel_name}</td>
                                <td>{b.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>
        </div>
    );
};

export default AdminDashboard;

