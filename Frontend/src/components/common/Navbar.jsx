import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import "../../styles/navbar.css";

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <nav className="navbar">
            <div className="nav-container">
                <Link to="/" className="nav-logo">
                    HotelBooking
                </Link>

                <div className="nav-links">
                    <Link to="/hotels">Hotels</Link>

                    {/* NORMAL USER ONLY */}
                    {user && user.role === "user" && (
                        <>
                            <Link to="/register-hotel">List Your Hotel</Link>
                            <Link to="/my-bookings">My Bookings</Link>
                        </>
                    )}

                    {/* NOT LOGGED IN */}
                    {!user && (
                        <>
                            <Link to="/login">Login</Link>
                            <Link to="/register" className="nav-btn">
                                Register
                            </Link>
                        </>
                    )}

                    {/* NORMAL USER */}
                    {user && user.role === "user" && (
                        <>
                            <span style={{ color: "#6b7280" }}>
                                Hi, {user.fullName.split(" ")[0]}
                            </span>
                            <button className="nav-btn" onClick={handleLogout}>
                                Logout
                            </button>
                        </>
                    )}

                    {/* ADMIN */}
                    {user && user.role === "admin" && (
                        <>
                            <Link to="/admin">Admin</Link>
                            <button className="nav-btn" onClick={handleLogout}>
                                Logout
                            </button>
                        </>
                    )}

                    {/* HOTEL ADMIN */}
                    {user && user.role === "hotel_admin" && (
                        <>
                            <Link to="/hotel-admin">My Hotel</Link>
                            <button className="nav-btn" onClick={handleLogout}>
                                Logout
                            </button>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
