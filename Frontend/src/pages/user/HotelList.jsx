import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getHotels, searchHotels } from "../../services/hotelService";
import HotelCard from "../../components/hotel/HotelCard";

const HotelList = () => {
    const [hotels, setHotels] = useState([]);
    const [loading, setLoading] = useState(true);

    const [searchParams] = useSearchParams();
    const city = searchParams.get("city");
    const checkIn = searchParams.get("checkIn");
    const checkOut = searchParams.get("checkOut");

    useEffect(() => {
        const fetchHotels = async () => {
            try {
                setLoading(true);

                // 🔍 If user searched from Home page
                if (city && checkIn && checkOut) {
                    const data = await searchHotels(city, checkIn, checkOut);
                    setHotels(data);
                }
                // 📃 Normal hotel listing (no search)
                else {
                    const data = await getHotels();
                    setHotels(data);
                }
            } catch (err) {
                console.error("Failed to load hotels", err);
                setHotels([]);
            } finally {
                setLoading(false);
            }
        };

        fetchHotels();
    }, [city, checkIn, checkOut]);

    if (loading) {
        return <p style={{ textAlign: "center" }}>Loading hotels...</p>;
    }

    return (
        <div className="hotel-grid">
            {hotels.length === 0 && (
                <p style={{ textAlign: "center" }}>
                    No hotels available for selected criteria.
                </p>
            )}

            {hotels.map((hotel) => (
                <HotelCard key={hotel.id} hotel={hotel} />
            ))}
        </div>
    );
};

export default HotelList;
