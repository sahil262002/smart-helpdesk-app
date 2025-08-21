import express from 'express';
import { createTicket, getTickets, getTicketById, addReply, getAuditLogsForTicket } from '../controllers/ticket.controller.js';
import { protect, agent } from '../middleware/auth.middleware.js';

const router = express.Router();

router.route('/')
    .post(protect, createTicket) // [cite: 72]
    .get(protect, getTickets); // [cite: 73]

router.route('/:id')
    .get(protect, getTicketById); // [cite: 74]

router.route('/:id/reply')
    .post(protect, agent, addReply); // [cite: 75]
    
router.route('/:id/audit')
    .get(protect, agent, getAuditLogsForTicket); // [cite: 83]

export default router;