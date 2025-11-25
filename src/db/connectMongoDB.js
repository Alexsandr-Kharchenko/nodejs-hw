import mongoose from 'mongoose';

export const connectMongoDB = async (mongoURL) => {
  try {
    await mongoose.connect(mongoURL);
    console.log('✅ Connected to MongoDB');
  } catch (err) {
    console.error('❌ Failed to connect to MongoDB', err);
    throw err;
  }
};
