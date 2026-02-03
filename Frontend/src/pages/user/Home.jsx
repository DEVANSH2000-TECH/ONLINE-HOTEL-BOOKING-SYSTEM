import { Link } from "react-router-dom";
import HotelImageCarousel from "../../components/hotel/HotelImageCarousel";
import HotelSearchForm from "../../components/hotel/HotelSearchForm";

const Home = () => {
    return (
        <>
            {/* HERO CAROUSEL */}
            <HotelImageCarousel variant="home" />

            {/* SEARCH FORM */}
            <HotelSearchForm />

            {/* EXISTING CONTENT */}
            <section style={{ padding: "3rem 1rem", textAlign: "center" }}>
                <h1>Book Hotels Easily & Securely</h1>
                <p style={{ margin: "1rem 0", color: "#6b7280" }}>
                    Discover verified hotels and book your stay in minutes.
                </p>

                <Link
                    to="/hotels"
                    style={{
                        padding: "0.6rem 1.2rem",
                        background: "#2563eb",
                        color: "white",
                        borderRadius: "8px",
                        fontWeight: 600,
                    }}
                >
                    Explore Hotels
                </Link>
            </section>
        </>
    );
};

export default Home;

