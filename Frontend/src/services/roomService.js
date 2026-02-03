import api from "./api";

export const getRoomsByHotel = async (hotelId) => {
    const response = await api.get(`/rooms/hotel/${hotelId}`);
    return response.data; // 🔥 THIS WAS MISSING
};
