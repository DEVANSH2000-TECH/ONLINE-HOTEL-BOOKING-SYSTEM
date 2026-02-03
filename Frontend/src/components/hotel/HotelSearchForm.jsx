import { useState } from "react";
import { useNavigate } from "react-router-dom";

const HotelSearchForm = () => {
    const navigate = useNavigate();

    const [city, setCity] = useState("");
    const [checkIn, setCheckIn] = useState("");
    const [checkOut, setCheckOut] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!city || !checkIn || !checkOut) {
            alert("Please fill all fields");
            return;
        }

        navigate(
            `/hotels?city=${city}&checkIn=${checkIn}&checkOut=${checkOut}`
        );
    };

    return (
        <form
            onSubmit={handleSubmit}
            style={{
                maxWidth: "1000px",
                margin: "-80px auto 3rem",   // ⬅️ pulls it over carousel
                background: "#fff",
                padding: "1.5rem",
                borderRadius: "12px",
                boxShadow: "0 15px 35px rgba(0,0,0,0.2)",
                display: "grid",
                gridTemplateColumns: "2fr 1fr 1fr auto",
                gap: "1rem",
                alignItems: "center",
                position: "relative",       // ✅ KEY FIX
                zIndex: 10,                  // ✅ KEY FIX
            }}
        >
            <input
                type="text"
                placeholder="Enter city or location"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                style={inputStyle}
            />

            <input
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                style={inputStyle}
            />

            <input
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                style={inputStyle}
            />

            <button
                type="submit"
                style={{
                    padding: "0.8rem 1.5rem",
                    background: "#2563eb",
                    color: "#fff",
                    border: "none",
                    borderRadius: "8px",
                    fontWeight: 600,
                    cursor: "pointer",
                }}
            >
                Search
            </button>
        </form>
    );
};

const inputStyle = {
    padding: "0.7rem",
    borderRadius: "8px",
    border: "1px solid #d1d5db",
    fontSize: "0.95rem",
};

export default HotelSearchForm;
