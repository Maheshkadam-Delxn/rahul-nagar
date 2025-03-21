import mongoose from 'mongoose';

const connectDb = async () => {
  if (mongoose.connections[0].readyState) return;
  
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('Connection failed:', error.message);
  }
};

export default connectDb;