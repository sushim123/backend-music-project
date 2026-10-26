import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import apiRoutes from './routes/index.js';
import { notFoundHandler, errorHandler } from './middleware/error.middleware.js';

const app = express();

// Security and utility middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Project & Task Management API',
    documentation: '/api/health',
    version: '1.0.0'
  });
});

// API Routes
app.use('/api', apiRoutes);

// 404 Catch-all handler
app.use(notFoundHandler);

// Centralized Error handler
app.use(errorHandler);

export default app;
