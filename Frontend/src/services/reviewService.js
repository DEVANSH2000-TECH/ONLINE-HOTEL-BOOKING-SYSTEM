import api from "./api";

export const getHotelReviews = (hotelId) =>
    api.get(`/reviews/hotel/${hotelId}`);

export const getHotelRatingSummary = (hotelId) =>
    api.get(`/reviews/hotel/${hotelId}/summary`);

export const addReview = (data) =>
    api.post("/reviews", data);
