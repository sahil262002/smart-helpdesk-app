import Ticket from '../models/Ticket.model.js';
import AuditLog from '../models/AuditLog.model.js';
import { triageTicket } from '../services/agent.service.js';
import logger from '../utils/logger.js';

export const createTicket = async (req, res) => {
    const { title, description } = req.body;
    try {
        const ticket = await Ticket.create({
            title,
            description,
            createdBy: req.user._id,
        });

        await AuditLog.create({ ticketId: ticket._id, traceId: 'initial', actor: 'user', action: 'TICKET_CREATED' });
        
        triageTicket(ticket._id).catch(err => logger.error(`Background triage failed: ${err}`));

        res.status(201).json(ticket);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

export const getTickets = async (req, res) => {
    try {
        
        const query = (req.user.role === 'user') ? { createdBy: req.user._id } : {};
        const tickets = await Ticket.find(query).sort({ createdAt: -1 });
        res.json(tickets);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

export const getTicketById = async (req, res) => {
    try {
        const ticket = await Ticket.findById(req.params.id)
            .populate('createdBy', 'name email')
            .populate('agentSuggestionId');
        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }
        res.json(ticket);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

export const addReply = async (req, res) => {
    // This is a simplified implementation. A real app would have a separate Reply model.
    try {
        const ticket = await Ticket.findById(req.params.id);
        if (ticket) {
            ticket.status = 'resolved'; // Or 'closed'
            // Append reply logic here
            await ticket.save();
            await AuditLog.create({ ticketId: ticket._id, traceId: 'manual', actor: 'agent', action: 'REPLY_SENT' });
            res.json(ticket);
        } else {
            res.status(404).json({ message: 'Ticket not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

export const getAuditLogsForTicket = async (req, res) => {
    try {
        const logs = await AuditLog.find({ ticketId: req.params.id }).sort({ timestamp: 1 });
        res.json(logs);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};