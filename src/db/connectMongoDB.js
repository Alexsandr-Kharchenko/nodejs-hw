import mongoose from 'mongoose';

const connectMongoDB = async (MONGO_URL) => {
  try {
    await mongoose.connect(MONGO_URL);
    console.log('✅ MongoDB connection established successfully');
  } catch (err) {
    console.error('❌ Failed to connect to MongoDB', err);
    process.exit(1);
  }
};

export default connectMongoDB;
