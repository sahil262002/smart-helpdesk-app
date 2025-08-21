import mongoose from 'mongoose';

const articleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  body: { type: String, required: true },
  tags: [{ type: String }],
  status: {
    type: String,
    enum: ['draft', 'published'],
    default: 'draft',
  },
}, { timestamps: true });

articleSchema.index({ title: 'text', body: 'text', tags: 'text' });

const Article = mongoose.model('Article', articleSchema);
export default Article;