import express from 'express';
import { createTicket, getTickets, getTicketById, addReply, getAuditLogsForTicket } from '../controllers/ticket.controller.js';
import { protect, agent } from '../middleware/auth.middleware.js';

const router = express.Router();

router.route('/')
    .post(protect, createTicket) 
    .get(protect, getTickets); 

router.route('/:id')
    .get(protect, getTicketById); 

router.route('/:id/reply')
    .post(protect, agent, addReply); 
    
router.route('/:id/audit')
    .get(protect, agent, getAuditLogsForTicket); 

export default router;