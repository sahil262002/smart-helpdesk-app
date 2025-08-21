import React, { useState, useEffect } from 'react';
import axios from 'axios';
import useAuthStore from '../store/authStore';
import useNotificationStore from '../store/notificationStore';

const KbAdminPage = () => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const token = useAuthStore((state) => state.token);
    const setNotification = useNotificationStore((state) => state.setNotification);

    
    const [form, setForm] = useState({ _id: null, title: '', body: '', tags: '', status: 'draft' });

    const fetchArticles = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            
            const { data } = await axios.get('http://localhost:8080/api/kb/all', config); 
            setArticles(data);
        } catch (error) {
            console.error(error);
            setNotification({ message: 'Could not fetch articles.', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchArticles();
    }, []);

    const handleFormChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const payload = { ...form, tags: form.tags.split(',').map(tag => tag.trim()) };
        const config = { headers: { Authorization: `Bearer ${token}` } };

        try {
            if (form._id) { 
                await axios.put(`http://localhost:8080/api/kb/${form._id}`, payload, config);
                setNotification({ message: 'Article updated!', type: 'success' });
            } else { 
                await axios.post('http://localhost:8080/api/kb', payload, config);
                setNotification({ message: 'Article created!', type: 'success' });
            }
            resetForm();
            fetchArticles();
        } catch (error) {
            setNotification({ message: 'Operation failed.', type: 'error' });
        }
    };

    const editArticle = (article) => {
        setForm({ ...article, tags: article.tags.join(', ') });
    };

    const deleteArticle = async (id) => {
        if (window.confirm('Are you sure you want to delete this article?')) {
            try {
                const config = { headers: { Authorization: `Bearer ${token}` } };
                await axios.delete(`http://localhost:8080/api/kb/${id}`, config);
                setNotification({ message: 'Article deleted.', type: 'success' });
                fetchArticles();
            } catch (error) {
                setNotification({ message: 'Could not delete article.', type: 'error' });
            }
        }
    };
    
    const resetForm = () => {
        setForm({ _id: null, title: '', body: '', tags: '', status: 'draft' });
    };

    return (
        <div>
            <h2>Knowledge Base Management</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
                <div>
                    <h3>Articles</h3>
                    {loading ? <p>Loading...</p> : (
                        <table style={{width: '100%', borderCollapse: 'collapse'}}>
                           {}
                        </table>
                    )}
                </div>
                <div>
                    <h3>{form._id ? 'Edit Article' : 'Create Article'}</h3>
                    <form onSubmit={handleFormSubmit}>
                        {}
                        <button type="submit">Save</button>
                        <button type="button" onClick={resetForm}>Cancel</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default KbAdminPage;