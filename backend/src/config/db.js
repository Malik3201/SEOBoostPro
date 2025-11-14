import mongoose from 'mongoose';

export const connectDB = async () => {
  const { MONGODB_URI } = process.env;

  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI environment variable is not set');
  }

  await mongoose.connect(MONGODB_URI, {
    autoIndex: true,
  });
};

export const db = mongoose.connection;

db.on('connected', () => {
  console.log('MongoDB connected');
});

db.on('error', (error) => {
  console.error('MongoDB connection error:', error);
});

