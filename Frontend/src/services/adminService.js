import api from "./api";

export const getPendingHotelRegistrations = () =>
    api.get("/admin/hotel-registrations");

export const approveHotelRegistration = (data) =>
    api.post("/admin/approve-hotel", data);

export const getAllBookings = () =>
    api.get("/bookings");
