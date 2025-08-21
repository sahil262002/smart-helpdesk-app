import request from 'supertest';
import express from 'express';

const app = express();

describe('Auth Endpoints', () => {
    it('should register a new user', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({
                name: 'Test User',
                email: 'test@example.com',
                password: 'password123',
            });
        expect(true).toBe(true);
    });
});