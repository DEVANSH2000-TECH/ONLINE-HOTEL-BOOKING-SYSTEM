import { useEffect, useState } from "react";
import axios from "axios";

const HotelImageCarousel = ({ images: propImages, variant = "detail" }) => {
    const [index, setIndex] = useState(0);
    const [images, setImages] = useState(propImages || []);

    /* ================= HOME PAGE MODE ================= */
    useEffect(() => {
        if (variant === "home") {
            axios
                .get("http://localhost:5000/api/hotels/homepage/images")
                .then(res => setImages(res.data))
                .catch(err => console.error("Home carousel error:", err));
        }
    }, [variant]);

    /* ================= AUTO SLIDE FOR HOME ================= */
    useEffect(() => {
        if (variant !== "home" || images.length <= 1) return;

        const interval = setInterval(() => {
            setIndex(i => (i + 1) % images.length);
        }, 3500);

        return () => clearInterval(interval);
    }, [images, variant]);

    if (!images || images.length === 0) {
        return (
            <div
                style={{
                    height: variant === "home" ? "80vh" : "320px",
                    background: "#e5e7eb",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#6b7280",
                }}
            >
                Loading hotels...
            </div>
        );
    }

    const isHome = variant === "home";

    return (
        <div
            style={{
                position: "relative",
                zIndex: 1,               // ✅ KEY FIX
                marginBottom: isHome ? 0 : "1.5rem",
            }}
        >
            <img
                src={`http://localhost:5000${images[index].image_url}`}
                alt="Hotel"
                style={{
                    width: "100%",
                    height: isHome ? "80vh" : "320px",
                    objectFit: "cover",
                    borderRadius: isHome ? "0" : "8px",
                }}
            />

            {/* Overlay text only for HOME */}
            {isHome && (
                <div
                    style={{
                        position: "absolute",
                        bottom: "20%",
                        left: "50%",
                        transform: "translateX(-50%)",
                        background: "rgba(0,0,0,0.5)",
                        color: "#fff",
                        padding: "20px 40px",
                        borderRadius: "10px",
                        textAlign: "center",
                    }}
                >
                    <h1>{images[index].name}</h1>
                    <p>{images[index].city}</p>
                </div>
            )}

            {/* Arrows ONLY for detail page */}
            {!isHome && images.length > 1 && (
                <>
                    <button
                        onClick={() =>
                            setIndex(i => (i - 1 + images.length) % images.length)
                        }
                        style={{
                            position: "absolute",
                            left: "10px",
                            top: "45%",
                        }}
                    >
                        ◀
                    </button>
                    <button
                        onClick={() =>
                            setIndex(i => (i + 1) % images.length)
                        }
                        style={{
                            position: "absolute",
                            right: "10px",
                            top: "45%",
                        }}
                    >
                        ▶
                    </button>
                </>
            )}
        </div>
    );
};

export default HotelImageCarousel;
