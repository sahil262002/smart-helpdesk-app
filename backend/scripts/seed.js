import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.model.js';
import Article from '../models/Article.model.js';
import Ticket from '../models/Ticket.model.js';
import Config from '../models/Config.model.js';

dotenv.config({ path: '../.env' });

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected...');
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};

const importData = async () => {
    await connectDB();
    try {
        await User.deleteMany();
        await Article.deleteMany();
        await Ticket.deleteMany();
        await Config.deleteMany();

        const adminUser = await User.create({ name: 'Admin User', email: 'admin@example.com', password_hash: '123456', role: 'admin' });
        const agentUser = await User.create({ name: 'Agent User', email: 'agent@example.com', password_hash: '123456', role: 'agent' });
        const regularUser = await User.create({ name: 'Test User', email: 'user@example.com', password_hash: '123456', role: 'user' });

        await Article.create([
            { title: 'How to update payment method', body: 'Go to your account settings and click on "Billing".', tags: ['billing', 'payments'], status: 'published' },
            { title: 'Troubleshooting 500 errors', body: 'A 500 error is a server-side error. Please check the server logs for more details.', tags: ['tech', 'errors'], status: 'published' },
            { title: 'Tracking your shipment', body: 'Once your order ships, you will receive an email with a tracking number.', tags: ['shipping', 'delivery'], status: 'published' }
        ]);

        await Ticket.create([
            { title: 'Refund for double charge', description: 'I was charged twice for order #1234 for my payment.', createdBy: regularUser._id },
            { title: 'App shows 500 on login', description: 'The app shows a server error when I try to login. The stack trace mentions an auth module.', createdBy: regularUser._id },
            { title: 'Where is my package?', description: 'My shipment has been delayed for 5 days.', createdBy: regularUser._id }
        ]);
        
        await Config.create({
            autoCloseEnabled: process.env.AUTO_CLOSE_ENABLED === 'true',
            confidenceThreshold: parseFloat(process.env.CONFIDENCE_THRESHOLD) || 0.75
        });

        console.log('Data Imported!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

importData();