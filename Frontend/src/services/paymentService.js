import api from "./api";

export const createPayment = async ({ bookingId, amount }) => {
    const response = await api.post("/payments", {
        bookingId,
        amount,
    });
    return response.data;
};
