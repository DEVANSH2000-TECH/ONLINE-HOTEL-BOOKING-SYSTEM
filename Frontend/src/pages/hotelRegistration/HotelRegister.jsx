import { useState, useEffect } from "react";
import { registerHotel } from "../../services/hotelRegistrationService";
import useAuth from "../../hooks/useAuth";

const HotelRegister = () => {
    const { user } = useAuth();

    const [form, setForm] = useState({
        hotelName: "",
        ownerName: "",
        email: "",
        phone: "",
        city: "",
    });

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    // Auto-fill email from logged-in user
    useEffect(() => {
        if (user?.email) {
            setForm((prev) => ({ ...prev, email: user.email }));
        }
    }, [user]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");

        try {
            await registerHotel(form);
            setMessage("Hotel registration submitted. Awaiting admin approval.");
            setForm({
                hotelName: "",
                ownerName: "",
                email: user.email,
                phone: "",
                city: "",
            });
        } catch (err) {
            setError(err.response?.data?.message || "Submission failed");
        }
    };

    return (
        <div style={{ maxWidth: "500px", margin: "2rem auto" }}>
            <h2>Register Your Hotel</h2>

            <p style={{ marginBottom: "1rem", color: "#6b7280" }}>
                You are registering a hotel using your logged-in account.
                After admin approval, this account will become a hotel admin.
            </p>

            {message && <p style={{ color: "green" }}>{message}</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}

            <form onSubmit={handleSubmit}>
                <input
                    name="hotelName"
                    placeholder="Hotel Name"
                    value={form.hotelName}
                    onChange={handleChange}
                    required
                />

                <input
                    name="ownerName"
                    placeholder="Owner Name"
                    value={form.ownerName}
                    onChange={handleChange}
                    required
                />

                <input
                    name="email"
                    value={form.email}
                    disabled
                />

                <input
                    name="phone"
                    placeholder="Phone Number"
                    value={form.phone}
                    onChange={handleChange}
                    required
                />

                <input
                    name="city"
                    placeholder="City"
                    value={form.city}
                    onChange={handleChange}
                    required
                />

                <button
                    style={{
                        marginTop: "1rem",
                        padding: "0.6rem",
                        background: "#2563eb",
                        color: "#fff",
                        borderRadius: "6px",
                    }}
                >
                    Submit Registration
                </button>
            </form>
        </div>
    );
};

export default HotelRegister;
