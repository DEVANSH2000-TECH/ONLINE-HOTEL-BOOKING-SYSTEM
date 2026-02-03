import { Link } from "react-router-dom";
import "../../styles/hotel.css";

const HotelCard = ({ hotel }) => {
    const imageUrl =
        hotel.cover_image
            ? `http://localhost:5000${hotel.cover_image}`
            : "/assets/images/hotel-placeholder.jpg";

    return (
        <div className="hotel-card">
            <img
                src={imageUrl}
                alt={hotel.name}
                className="hotel-card-image"
            />

            <div className="hotel-card-body">
                <h3>{hotel.name}</h3>
                <p className="hotel-city">{hotel.city}</p>

                <Link to={`/hotels/${hotel.id}`} className="hotel-btn">
                    View Details
                </Link>
            </div>
        </div>
    );
};

export default HotelCard;
