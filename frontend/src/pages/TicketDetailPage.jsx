import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import useAuthStore from '../store/authStore';
import useNotificationStore from '../store/notificationStore';

const TicketDetailPage = () => {
    const { id } = useParams();
    const [ticket, setTicket] = useState(null);
    const [auditLogs, setAuditLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [replyText, setReplyText] = useState('');
    const [isReplying, setIsReplying] = useState(false);
    const { user, token } = useAuthStore();
    const setNotification = useNotificationStore((state) => state.setNotification);

    const fetchTicketDetails = async () => {
        setLoading(true);
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const { data: ticketData } = await axios.get(`http://localhost:8080/api/tickets/${id}`, config);
            setTicket(ticketData);
            if (ticketData?.agentSuggestionId?.draftReply) {
                setReplyText(ticketData.agentSuggestionId.draftReply);
            }
            const { data: auditData } = await axios.get(`http://localhost:8080/api/tickets/${id}/audit`, config);
            setAuditLogs(auditData);
        } catch (error) {
            console.error('Failed to fetch ticket details', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTicketDetails();
    }, [id, token]);
    
    const handleSendReply = async () => {
        setIsReplying(true);
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await axios.post(`http://localhost:8080/api/tickets/${id}/reply`, { reply: replyText }, config);
            setNotification({ message: 'Reply sent!', type: 'success' });
            fetchTicketDetails(); // Refresh data
        } catch (error) {
            setNotification({ message: 'Failed to send reply.', type: 'error' });
        } finally {
            setIsReplying(false);
        }
    };

    if (loading) return <div className="text-center mt-8">Loading ticket details...</div>;
    if (!ticket) return <div className="text-center mt-8">Ticket not found.</div>;

    const { agentSuggestionId: suggestion } = ticket;

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h1 className="text-3xl font-bold text-gray-900">{ticket.title}</h1>
                <p className="mt-2 text-sm text-gray-500">Status: {ticket.status}</p>
                <p className="mt-4 text-gray-700 whitespace-pre-wrap">{ticket.description}</p>
            </div>

            {suggestion && (
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold text-gray-800">Agent Suggestion</h2>
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <p><strong>Predicted Category:</strong> {suggestion.predictedCategory}</p>
                        <p><strong>Confidence:</strong> {(suggestion.confidence * 100).toFixed(0)}%</p>
                    </div>
                    <div className="mt-4">
                        <p className="font-semibold">Suggested Reply:</p>
                        <pre className="mt-2 p-4 bg-gray-100 rounded-md text-gray-800 whitespace-pre-wrap font-sans">{suggestion.draftReply}</pre>
                    </div>
                </div>
            )}
            
            {user && (user.role === 'agent' || user.role === 'admin') && ticket.status === 'waiting_human' && (
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold text-gray-800">Agent Review & Reply</h2>
                     <textarea value={replyText} onChange={(e) => setReplyText(e.target.value)} className="mt-4 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm min-h-[150px]"/>
                    <button onClick={handleSendReply} disabled={isReplying} className="mt-4 inline-flex justify-center py-2 px-4 rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50">
                        {isReplying ? 'Sending...' : 'Send Reply & Resolve'}
                    </button>
                </div>
            )}
            
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold text-gray-800">Audit Timeline</h2>
                <ul className="mt-4 space-y-4">
                    {auditLogs.map(log => (
                        <li key={log._id} className="flex items-start text-sm">
                            <span className="font-mono text-gray-500 w-40">{new Date(log.timestamp).toLocaleString()}</span>
                            <span className="ml-4 font-semibold text-gray-700">{log.actor}</span>
                            <span className="ml-4 text-gray-600">{log.action.replace(/_/g, ' ').toLowerCase()}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default TicketDetailPage;