import api from "./api";

/* ================= GET ALL HOTELS (OPTIONAL CITY FILTER) ================= */
export const getHotels = async (city) => {
    const response = await api.get("/hotels", {
        params: city ? { city } : {},
    });
    return response.data;
};

/* ================= GET SINGLE HOTEL ================= */
export const getHotelById = async (id) => {
    const response = await api.get(`/hotels/${id}`);
    return response.data;
};

/* ================= SEARCH HOTELS (CITY + DATES) ================= */
export const searchHotels = async (city, checkIn, checkOut) => {
    const response = await api.get("/hotels/search", {
        params: {
            city,
            checkIn,
            checkOut,
        },
    });
    return response.data;
};
