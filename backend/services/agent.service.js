import { v4 as uuidv4 } from 'uuid';
import Ticket from '../models/Ticket.model.js';
import Article from '../models/Article.model.js';
import AgentSuggestion from '../models/AgentSuggestion.model.js';
import AuditLog from '../models/AuditLog.model.js';
import Config from '../models/Config.model.js';
import logger from '../utils/logger.js';


const classifyTicket = (title, description) => {
    
    const searchText = `${title.toLowerCase()} ${description.toLowerCase()}`;
    
    const billingKeywords = ["refund", "invoice", "charge", "payment", "bill", "subscription"];
    const techKeywords = [
        "error", "bug", "stack", "login", "500", 
        "fault", "software", "windows", "not working", "crash", "issue", "feature", "api", "server" 
    ];
    const shippingKeywords = ["delivery", "shipment", "package", "tracking", "where is my order"];

    let matches = 0;
    if (billingKeywords.some(k => searchText.includes(k))) {
        matches++;
        return { predictedCategory: 'billing', confidence: Math.min(0.6 + matches * 0.1, 0.95) };
    }
    if (techKeywords.some(k => searchText.includes(k))) {
        matches++;
        return { predictedCategory: 'tech', confidence: Math.min(0.6 + matches * 0.1, 0.95) };
    }
    if (shippingKeywords.some(k => searchText.includes(k))) {
        matches++;
        return { predictedCategory: 'shipping', confidence: Math.min(0.6 + matches * 0.1, 0.95) };
    }
    return { predictedCategory: 'other', confidence: 0.3 };
};


const retrieveKBArticles = async (query) => {
    const articles = await Article.find(
        { $text: { $search: query }, status: 'published' },
        { score: { $meta: "textScore" } }
    ).sort({ score: { $meta: "textScore" } }).limit(3);
    return articles;
};


const draftReply = (articles) => {
    if (articles.length === 0) {
        return { draftReply: "Our team will look into your issue and get back to you shortly.", citations: [] };
    }
    const reply = `Thank you for reaching out. Based on your query, here are some articles that might help:\n\n${articles.map((a, i) => `${i + 1}. ${a.title}`).join('\n')}\n\nIf these don't solve your issue, an agent will be with you shortly.`;
    return { draftReply: reply, citations: articles.map(a => a._id) };
};


export const triageTicket = async (ticketId) => {
    const traceId = uuidv4();
    const startTime = Date.now();
    
    try {
        const ticket = await Ticket.findById(ticketId);
        if (!ticket) {
            logger.error(`Triage failed: Ticket ${ticketId} not found.`);
            return;
        }

        await AuditLog.create({ ticketId, traceId, actor: 'system', action: 'AGENT_TRIAGE_STARTED' });

       
        const classification = classifyTicket(ticket.title, ticket.description);
        await AuditLog.create({ ticketId, traceId, actor: 'system', action: 'AGENT_CLASSIFIED', meta: classification });
        
        
        const relevantArticles = await retrieveKBArticles(ticket.title + ' ' + ticket.description);
        await AuditLog.create({ ticketId, traceId, actor: 'system', action: 'KB_RETRIEVED', meta: { count: relevantArticles.length, articleIds: relevantArticles.map(a => a._id) } });

        
        const { draftReply: reply, citations } = draftReply(relevantArticles);
        await AuditLog.create({ ticketId, traceId, actor: 'system', action: 'DRAFT_GENERATED', meta: { hasReply: !!reply } });

        
        const config = await Config.getSingleton();
        const { confidence } = classification;
        let autoClosed = false;
        
        if (config.autoCloseEnabled && confidence >= config.confidenceThreshold) {
            autoClosed = true;
            ticket.status = 'resolved';
            
            ticket.description += `\n\n--- Auto-Reply ---\n${reply}`;
            await AuditLog.create({ ticketId, traceId, actor: 'system', action: 'AUTO_CLOSED' });
        } else {
            ticket.status = 'waiting_human';
            await AuditLog.create({ ticketId, traceId, actor: 'system', action: 'ASSIGNED_TO_HUMAN' });
        }
        
        const latencyMs = Date.now() - startTime;

        
        const suggestion = await AgentSuggestion.create({
            ticketId,
            predictedCategory: classification.predictedCategory,
            articleIds: citations,
            draftReply: reply,
            confidence: confidence,
            autoClosed,
            modelInfo: { provider: 'stub', model: 'keyword-v1.1', promptVersion: '1.1', latencyMs },
        });

        
        ticket.agentSuggestionId = suggestion._id;
        ticket.category = classification.predictedCategory;
        await ticket.save();
        
        logger.info(`Triage completed for ticket ${ticketId} with traceId ${traceId}`);

    } catch (error) {
        logger.error(`Error during triage for ticket ${ticketId}: ${error}`);
        await AuditLog.create({ ticketId, traceId, actor: 'system', action: 'AGENT_TRIAGE_FAILED', meta: { error: error.message } });
    }
};