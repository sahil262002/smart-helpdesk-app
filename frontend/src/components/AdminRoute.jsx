import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from '../store/authStore.js';

const AdminRoute = () => {
    const { token, user } = useAuthStore((state) => state);
    
    if (!token) {
        return <Navigate to="/login" />;
    }

    if (user?.role !== 'admin') {
        return <Navigate to="/" />;
    }

    // If all checks pass, render the admin component via <Outlet />
    return <Outlet />;
};

export default AdminRoute;