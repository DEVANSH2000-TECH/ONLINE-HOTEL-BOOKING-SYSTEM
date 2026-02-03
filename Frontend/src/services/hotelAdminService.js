import api from "./api";

export const addRoom = (data) => api.post("/rooms", data);

export const getRoomsByHotel = (hotelId) =>
    api.get(`/rooms/hotel/${hotelId}`);

export const getBookings = () => api.get("/bookings");

/* ✅ FIXED ENDPOINT */
export const getMyHotel = () =>
    api.get("/hotel-admin/my-hotel");
