import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import logger from './utils/logger.js';


import authRoutes from './routes/auth.routes.js';
import ticketRoutes from './routes/ticket.routes.js';
import kbRoutes from './routes/kb.routes.js';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`);
  next();
});


mongoose.connect(process.env.MONGO_URI)
  .then(() => logger.info('MongoDB connected successfully.'))
  .catch(err => logger.error(`MongoDB connection error: ${err}`));


app.get('/healthz', (req, res) => res.status(200).json({ status: 'ok' }));
app.use('/api/auth', authRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/kb', kbRoutes);


app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).json({ message: 'Something went wrong on the server.' });
});

app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});