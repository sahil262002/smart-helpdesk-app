import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.js'; // <-- Import useAuth

const Navbar = () => {
    const { user, token, logout } = useAuth(); // <-- Use the context hook
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };
    
    // ... rest of the component remains the same
    return (
        <nav className="bg-gray-800 shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center space-x-4">
                        <Link to="/" className="text-white font-bold text-xl">Helpdesk</Link>
                        <div className="hidden md:block">
                            <div className="ml-10 flex items-baseline space-x-4">
                                {token && <Link to="/" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">My Tickets</Link>}
                                {user?.role === 'user' && <Link to="/tickets/new" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">New Ticket</Link>}
                                {user?.role === 'admin' && (
                                    <>
                                        <Link to="/admin/kb" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">KB Management</Link>
                                        <Link to="/admin/settings" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Settings</Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="hidden md:block">
                        {token ? (
                            <div className="ml-4 flex items-center md:ml-6">
                                <span className="text-gray-300 mr-4">Welcome, {user?.name}</span>
                                <button onClick={handleLogout} className="bg-indigo-600 text-white hover:bg-indigo-700 px-3 py-2 rounded-md text-sm font-medium">Logout</button>
                            </div>
                        ) : (
                            <Link to="/login" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Login</Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;