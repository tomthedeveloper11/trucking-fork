import mongoose from 'mongoose';

export default async function connectDb() {
  try {
    const db = await mongoose.connect('mongodb://localhost:27017/trucking');
    console.log('Mongoose Connection Established');
    return db.connection;
  } catch (error) {
    console.log('Mongoose connection failed', error);
    throw error;
  }
}
