import { Routes, Route } from "react-router-dom";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

import Home from "../pages/user/Home";
import HotelList from "../pages/user/HotelList";
import HotelDetails from "../pages/user/HotelDetails";
import Booking from "../pages/user/Booking";
import Payment from "../pages/user/Payment";
import BookingSuccess from "../pages/user/BookingSuccess";
import MyBookings from "../pages/user/MyBookings";

import HotelRegister from "../pages/hotelRegistration/HotelRegister";

import AdminDashboard from "../pages/admin/AdminDashboard";
import HotelAdminDashboard from "../pages/admin/HotelAdminDashboard";

import ProtectedRoute from "../components/common/ProtectedRoute";

const AppRoutes = () => (
    <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/hotels" element={<HotelList />} />
        <Route path="/hotels/:id" element={<HotelDetails />} />

        {/* Hotel Registration */}
        <Route
            path="/register-hotel"
            element={
                <ProtectedRoute>
                    <HotelRegister />
                </ProtectedRoute>
            }
        />

        {/* User Protected Routes */}
        <Route
            path="/booking"
            element={
                <ProtectedRoute>
                    <Booking />
                </ProtectedRoute>
            }
        />

        <Route
            path="/payment"
            element={
                <ProtectedRoute>
                    <Payment />
                </ProtectedRoute>
            }
        />

        <Route
            path="/booking-success"
            element={
                <ProtectedRoute>
                    <BookingSuccess />
                </ProtectedRoute>
            }
        />

        {/* ✅ MY BOOKINGS (FIX) */}
        <Route
            path="/my-bookings"
            element={
                <ProtectedRoute role="user">
                    <MyBookings />
                </ProtectedRoute>
            }
        />

        {/* Admin Protected Route */}
        <Route
            path="/admin"
            element={
                <ProtectedRoute role="admin">
                    <AdminDashboard />
                </ProtectedRoute>
            }
        />

        {/* Hotel Admin Protected Route */}
        <Route
            path="/hotel-admin"
            element={
                <ProtectedRoute role="hotel_admin">
                    <HotelAdminDashboard />
                </ProtectedRoute>
            }
        />
    </Routes>
);

export default AppRoutes;
