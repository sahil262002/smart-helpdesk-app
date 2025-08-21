import { describe, it, expect } from 'vitest';
import request from 'supertest';
import express from 'express';


const app = express();
app.use(express.json());


app.post('/api/auth/register', (req, res) => {
    const { name, email, password } = req.body;
    if (name && email && password) {
        res.status(201).json({ message: 'User created' });
    } else {
        res.status(400).json({ message: 'Invalid data' });
    }
});


describe('Auth Endpoints', () => {
    it('should respond with a 201 status for a valid registration', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({
                name: 'Test User',
                email: 'test@example.com',
                password: 'password123',
            });

        expect(res.statusCode).toEqual(201);
    });
});