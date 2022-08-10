import mongoose from 'mongoose';

export default async function connectDb() {
  try {
    const db = await mongoose.connect(
      process.env.MONGO_DB_URL || 'mongodb://localhost:27017/trucking'
    );
    console.log('Mongoose Connection Established');
    return db.connection;
  } catch (error) {
    console.log('Mongoose connection failed', error);
    throw error;
  }
}
