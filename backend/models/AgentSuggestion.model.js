import mongoose from 'mongoose';

const agentSuggestionSchema = new mongoose.Schema({
  ticketId: { type: mongoose.Schema.Types.ObjectId, ref: 'Ticket', required: true },
  predictedCategory: { type: String, required: true },
  articleIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Article' }],
  draftReply: { type: String, required: true },
  confidence: { type: Number, required: true },
  autoClosed: { type: Boolean, default: false },
  modelInfo: {
    provider: { type: String },
    model: { type: String },
    promptVersion: { type: String },
    latencyMs: { type: Number },
  },
}, { timestamps: true });

const AgentSuggestion = mongoose.model('AgentSuggestion', agentSuggestionSchema);
export default AgentSuggestion;