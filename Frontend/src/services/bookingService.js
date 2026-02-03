import api from "./api";

export const createBooking = async (data) => {
    const response = await api.post("/bookings", data);
    return response.data;
};

export const getMyBookings = async () => {
    const response = await api.get("/bookings");
    return response.data;
};

// ❌ Cancel booking (NEW)
export const cancelBooking = async (bookingId) => {
    const response = await api.patch(`/bookings/${bookingId}/cancel`);
    return response.data;
};
