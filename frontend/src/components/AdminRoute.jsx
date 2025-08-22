import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.js'; // <-- Import useAuth

const AdminRoute = () => {
    const { token, user } = useAuth(); // <-- Use the context hook
    
    if (!token) {
        return <Navigate to="/login" />;
    }

    if (user?.role !== 'admin') {
        return <Navigate to="/" />;
    }

    return <Outlet />;
};

export default AdminRoute;