import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

import auditRouter from './routes/audit.js';
import reportRouter from './routes/report.js';
import adminRouter from './routes/admin.js';
import serviceRouter from './routes/service.js';
import { connectDB } from './config/db.js';

dotenv.config();

const allowedOrigins = [
  process.env.FRONTEND_BASE_URL,
  'http://localhost:5173',
  'https://localhost:5173',
  'https://seoboostpro.netlify.app',
  'http://localhost:3000',
  'http://localhost:5174',
].filter(Boolean);

// Normalize origins (remove trailing slashes)
const normalizedOrigins = allowedOrigins.map(origin => origin.replace(/\/$/, ''));

const app = express();

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) {
        return callback(null, true);
      }
      
      // Normalize the origin (remove trailing slash)
      const normalizedOrigin = origin.replace(/\/$/, '');
      
      // Check if origin is in allowed list
      if (normalizedOrigins.includes(normalizedOrigin)) {
        return callback(null, true);
      }
      
      // Log for debugging
      console.log('CORS blocked origin:', origin);
      console.log('Allowed origins:', normalizedOrigins);
      
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware to ensure DB connection before handling requests (important for serverless)
app.use(async (req, res, next) => {
  try {
    // Check if already connected
    if (mongoose.connection.readyState === 1) {
      return next();
    }
    
    // If not connected, establish connection
    if (mongoose.connection.readyState === 0) {
      await connectDB();
    }
    
    next();
  } catch (error) {
    console.error('Database connection error in middleware:', error);
    res.status(500).json({ message: 'Database connection failed' });
  }
});

app.use('/api/audit', auditRouter);
app.use('/api/report', reportRouter);
app.use('/api/admin', adminRouter);
app.use('/api/service', serviceRouter);

app.use((req, res, next) => {
  const error = new Error('Not Found');
  error.status = 404;
  next(error);
});

app.get("/", (req,res)=>{
  res.json("SERVER STARTED SUCCESSFULLY")
})

app.use((err, req, res, next) => {
  const status = err.status || 500;
  res.status(status).json({
    message: err.message || 'Internal Server Error',
  });
});

export default app;
