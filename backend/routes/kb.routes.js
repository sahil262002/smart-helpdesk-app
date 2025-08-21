import express from 'express';
import { createArticle, getArticles, getArticleById, updateArticle, deleteArticle } from '../controllers/kb.controller.js';
import { protect, admin } from '../middleware/auth.middleware.js';

const router = express.Router();

router.route('/')
    .get(protect, getArticles) // All authenticated users can search KB [cite: 68]
    .post(protect, admin, createArticle); // [cite: 69]

router.route('/:id')
    .get(protect, getArticleById)
    .put(protect, admin, updateArticle) // [cite: 71]
    .delete(protect, admin, deleteArticle); // [cite: 71]

export default router;