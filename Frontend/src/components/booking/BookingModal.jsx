import { useState } from "react";

const BookingModal = ({ room, onClose, onProceed }) => {
    const [checkIn, setCheckIn] = useState("");
    const [checkOut, setCheckOut] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!checkIn || !checkOut) {
            alert("Please select check-in and check-out dates");
            return;
        }

        if (new Date(checkOut) <= new Date(checkIn)) {
            alert("Check-out must be after check-in");
            return;
        }

        onProceed({
            roomId: room.id,
            checkIn,
            checkOut,
        });
    };

    return (
        <div style={overlayStyle}>
            <div style={modalStyle}>
                <h3>Book Room</h3>

                <p><strong>{room.room_type}</strong></p>
                <p>₹{room.price} / night</p>

                <form onSubmit={handleSubmit}>
                    <label>Check-in</label>
                    <input
                        type="date"
                        value={checkIn}
                        onChange={(e) => setCheckIn(e.target.value)}
                        style={inputStyle}
                    />

                    <label>Check-out</label>
                    <input
                        type="date"
                        value={checkOut}
                        onChange={(e) => setCheckOut(e.target.value)}
                        style={inputStyle}
                    />

                    <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
                        <button type="submit" style={btnPrimary}>
                            Proceed to Payment
                        </button>
                        <button type="button" onClick={onClose} style={btnSecondary}>
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const overlayStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
};

const modalStyle = {
    background: "#fff",
    padding: "2rem",
    borderRadius: "10px",
    width: "350px",
};

const inputStyle = {
    width: "100%",
    marginBottom: "10px",
};

const btnPrimary = {
    flex: 1,
    padding: "8px",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
};

const btnSecondary = {
    flex: 1,
    padding: "8px",
    background: "#e5e7eb",
    border: "none",
    borderRadius: "6px",
};

export default BookingModal;
