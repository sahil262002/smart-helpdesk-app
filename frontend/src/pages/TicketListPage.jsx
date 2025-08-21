import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import useAuthStore from '../store/authStore';

const TicketListPage = () => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const token = useAuthStore((state) => state.token);

    useEffect(() => {
        const fetchTickets = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${token}` } };
                const { data } = await axios.get('http://localhost:8080/api/tickets', config);
                setTickets(data);
            } catch (error) {
                console.error('Failed to fetch tickets', error);
            } finally {
                setLoading(false);
            }
        };
        fetchTickets();
    }, [token]);

    const getStatusBadge = (status) => {
        const styles = {
            open: 'bg-blue-100 text-blue-800',
            waiting_human: 'bg-yellow-100 text-yellow-800',
            resolved: 'bg-green-100 text-green-800',
            closed: 'bg-gray-100 text-gray-800',
        };
        return `px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${styles[status] || styles.closed}`;
    };

    if (loading) return <div className="text-center mt-8">Loading tickets...</div>;

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Support Tickets</h1>
            <div className="bg-white shadow-md rounded-lg">
                <ul className="divide-y divide-gray-200">
                    {tickets.length > 0 ? tickets.map((ticket) => (
                        <li key={ticket._id}>
                            <Link to={`/tickets/${ticket._id}`} className="block hover:bg-gray-50 p-4 sm:p-6">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm font-medium text-indigo-600 truncate">{ticket.title}</p>
                                    <div className="ml-2 flex-shrink-0 flex">
                                        <p className={getStatusBadge(ticket.status)}>{ticket.status.replace('_', ' ')}</p>
                                    </div>
                                </div>
                                <div className="mt-2 sm:flex sm:justify-between">
                                    <div className="sm:flex">
                                        <p className="flex items-center text-sm text-gray-500">
                                            Created on {new Date(ticket.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        </li>
                    )) : (
                        <p className="text-center text-gray-500 p-6">You have not created any tickets yet.</p>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default TicketListPage;