import Article from '../models/Article.model.js';
import mongoose from 'mongoose';

export const createArticle = async (req, res) => {
    const { title, body, tags, status } = req.body;
    try {
        const article = new Article({ title, body, tags, status });
        const createdArticle = await article.save();
        res.status(201).json(createdArticle);
    } catch (error) {
        res.status(400).json({ message: 'Invalid article data', error: error.message });
    }
};

export const getArticles = async (req, res) => {
    const { query } = req.query;
    try {
        const articles = query
            ? await Article.find({ $text: { $search: query }, status: 'published' })
            : await Article.find({ status: 'published' });
        res.json(articles);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

export const getArticleById = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: 'Invalid article ID' });
        }
        const article = await Article.findById(req.params.id);
        if (article) {
            res.json(article);
        } else {
            res.status(404).json({ message: 'Article not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

export const updateArticle = async (req, res) => {
    const { title, body, tags, status } = req.body;
    try {
        const article = await Article.findById(req.params.id);
        if (article) {
            article.title = title || article.title;
            article.body = body || article.body;
            article.tags = tags || article.tags;
            article.status = status || article.status;
            const updatedArticle = await article.save();
            res.json(updatedArticle);
        } else {
            res.status(404).json({ message: 'Article not found' });
        }
    } catch (error) {
        res.status(400).json({ message: 'Invalid article data', error: error.message });
    }
};

export const deleteArticle = async (req, res) => {
    try {
        const article = await Article.findById(req.params.id);
        if (article) {
            await article.deleteOne();
            res.json({ message: 'Article removed' });
        } else {
            res.status(404).json({ message: 'Article not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};