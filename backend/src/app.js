import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';

import auditRouter from './routes/audit.js';
import reportRouter from './routes/report.js';
import adminRouter from './routes/admin.js';
import serviceRouter from './routes/service.js';

dotenv.config();

const allowedOrigins = [
  process.env.FRONTEND_BASE_URL,
  'http://localhost:5173',
  'https://localhost:5173',
].filter(Boolean);

const app = express();

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/audit', auditRouter);
app.use('/api/report', reportRouter);
app.use('/api/admin', adminRouter);
app.use('/api/service', serviceRouter);

app.use((req, res, next) => {
  const error = new Error('Not Found');
  error.status = 404;
  next(error);
});

app.use((err, req, res, next) => {
  const status = err.status || 500;
  res.status(status).json({
    message: err.message || 'Internal Server Error',
  });
});

export default app;
