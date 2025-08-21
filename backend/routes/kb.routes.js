import express from 'express';
import { createArticle, getArticles, getArticleById, updateArticle, deleteArticle } from '../controllers/kb.controller.js';
import { protect, admin } from '../middleware/auth.middleware.js';

const router = express.Router();

router.route('/')
    .get(protect, getArticles) 
    .post(protect, admin, createArticle); 

router.route('/:id')
    .get(protect, getArticleById)
    .put(protect, admin, updateArticle) 
    .delete(protect, admin, deleteArticle); 

export default router;