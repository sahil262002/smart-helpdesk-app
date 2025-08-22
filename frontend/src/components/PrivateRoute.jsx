import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.js'; // <-- Import useAuth

const PrivateRoute = () => {
    const { token } = useAuth(); // <-- Use the context hook

    return token ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;