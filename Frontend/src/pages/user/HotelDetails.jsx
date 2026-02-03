import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

import { getHotelById } from "../../services/hotelService";
import { getRoomsByHotel } from "../../services/roomService";
import {
    getHotelReviews,
    getHotelRatingSummary,
    addReview,
} from "../../services/reviewService";

import RoomCard from "../../components/hotel/RoomCard";
import BookingModal from "../../components/booking/BookingModal";
import Stars from "../../components/ui/Stars";
import Loaders from "../../components/common/Loaders";
import HotelImageCarousel from "../../components/hotel/HotelImageCarousel";

const HotelDetails = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [hotel, setHotel] = useState(null);
    const [rooms, setRooms] = useState([]);
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);

    const [selectedRoom, setSelectedRoom] = useState(null);

    const [reviews, setReviews] = useState([]);
    const [summary, setSummary] = useState({
        avgRating: "0.0",
        totalReviews: 0,
    });

    const [reviewForm, setReviewForm] = useState({
        rating: 5,
        comment: "",
    });

    const [reviewError, setReviewError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const hotelData = await getHotelById(id);
                setHotel(hotelData?.hotel || null);
                setImages(hotelData?.images || []);

                const roomsData = await getRoomsByHotel(id);
                setRooms(
                    Array.isArray(roomsData)
                        ? roomsData
                        : Array.isArray(roomsData?.rooms)
                            ? roomsData.rooms
                            : []
                );

                const reviewsData = await getHotelReviews(id);
                setReviews(Array.isArray(reviewsData) ? reviewsData : []);

                const summaryData = await getHotelRatingSummary(id);
                setSummary(summaryData || summary);
            } catch (err) {
                console.error("Failed to load hotel details", err);
            } finally {
                setLoading(false);
            }
        };

        fetchDetails();
    }, [id]);

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        setReviewError("");
        setSubmitting(true);

        try {
            await addReview({
                hotelId: id,
                rating: reviewForm.rating,
                comment: reviewForm.comment,
            });

            setReviewForm({ rating: 5, comment: "" });

            setReviews(await getHotelReviews(id));
            setSummary(await getHotelRatingSummary(id));
        } catch (err) {
            setReviewError(
                err.response?.data?.message || "Unable to submit review"
            );
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <Loaders text="Loading hotel details..." />;
    if (!hotel) return <p style={{ textAlign: "center" }}>Hotel not found</p>;

    return (
        <div className="hotel-details">
            <HotelImageCarousel images={images} />

            <div className="hotel-header">
                <h2>{hotel.name}</h2>
                <p>{hotel.city}</p>
                <p>{hotel.description}</p>

                <Stars rating={summary.avgRating} />
                <p style={{ color: "#6b7280" }}>
                    {summary.avgRating} / 5 ({summary.totalReviews} reviews)
                </p>
            </div>

            <h3>Available Rooms</h3>

            <div className="room-list">
                {rooms.length === 0 && (
                    <p style={{ color: "#6b7280" }}>
                        No rooms available at the moment.
                    </p>
                )}

                {rooms.map((room) => (
                    <RoomCard
                        key={room.id}
                        room={room}
                        hotelId={hotel.id}
                        onBook={(room) => setSelectedRoom(room)}
                    />
                ))}
            </div>

            {selectedRoom && (
                <BookingModal
                    room={selectedRoom}
                    onClose={() => setSelectedRoom(null)}
                    onProceed={(bookingData) => {
                        navigate("/payment", {
                            state: {
                                hotel,
                                room: selectedRoom,
                                booking: bookingData,
                            },
                        });
                    }}
                />
            )}

            <hr style={{ margin: "3rem 0" }} />

            <h3>Guest Reviews</h3>

            {user && (
                <form onSubmit={handleReviewSubmit}>
                    {reviewError && (
                        <p style={{ color: "red" }}>{reviewError}</p>
                    )}

                    <select
                        value={reviewForm.rating}
                        onChange={(e) =>
                            setReviewForm({
                                ...reviewForm,
                                rating: e.target.value,
                            })
                        }
                    >
                        {[5, 4, 3, 2, 1].map((n) => (
                            <option key={n} value={n}>
                                {n} Star{n > 1 && "s"}
                            </option>
                        ))}
                    </select>

                    <textarea
                        placeholder="Write your review"
                        value={reviewForm.comment}
                        onChange={(e) =>
                            setReviewForm({
                                ...reviewForm,
                                comment: e.target.value,
                            })
                        }
                    />

                    <button disabled={submitting}>
                        {submitting ? "Submitting..." : "Submit Review"}
                    </button>
                </form>
            )}

            {reviews.map((r, i) => (
                <div key={i}>
                    <strong>{r.full_name}</strong>
                    <Stars rating={r.rating} />
                    <p>{r.comment}</p>
                </div>
            ))}
        </div>
    );
};

export default HotelDetails;
