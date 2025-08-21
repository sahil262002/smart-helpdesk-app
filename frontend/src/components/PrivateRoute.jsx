import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from '../store/authStore.js';

const PrivateRoute = () => {
    const { token } = useAuthStore((state) => state);

    
    return token ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;