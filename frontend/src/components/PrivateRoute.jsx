import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from '../store/authStore.js';

const PrivateRoute = () => {
    const { token } = useAuthStore((state) => state);

    // If there is a token, render the child component via <Outlet />.
    // Otherwise, redirect to the login page.
    return token ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;