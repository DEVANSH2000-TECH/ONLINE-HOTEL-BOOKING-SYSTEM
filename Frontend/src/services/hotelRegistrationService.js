import api from "./api";

export const registerHotel = (data) =>
    api.post("/hotel-registration", data);
