import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import useNotificationStore from '../store/notificationStore';

const NewTicketPage = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const token = useAuthStore((state) => state.token);
    const setNotification = useNotificationStore((state) => state.setNotification);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title || !description) {
            setNotification({ message: 'Title and description are required.', type: 'error' });
            return;
        }
        setLoading(true);
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await axios.post('http://localhost:8080/api/tickets', { title, description }, config);
            setNotification({ message: 'Ticket created successfully!', type: 'success' });
            navigate('/');
        } catch (error) {
            console.error('Failed to create ticket', error);
            setNotification({ message: 'Failed to create ticket.', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2>Create a New Ticket</h2>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '1rem' }}>
                    <label>Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        style={{ width: '100%', padding: '8px' }}
                        required
                    />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                    <label>Description</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        style={{ width: '100%', padding: '8px', minHeight: '150px' }}
                        required
                    ></textarea>
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? 'Submitting...' : 'Submit Ticket'}
                </button>
            </form>
        </div>
    );
};

export default NewTicketPage;