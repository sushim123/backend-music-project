import mongoose from 'mongoose';
import dns from 'node:dns';

// Fix for Windows / Node.js DNS SRV resolution error (querySrv ECONNREFUSED) with MongoDB Atlas
try {
  dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
} catch (dnsErr) {
  console.warn('⚠️ Could not set custom DNS servers:', dnsErr.message);
}

export const connectMongo = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/task_management_db';
    
    // Mask credentials for clean terminal logging
    const maskedUri = mongoUri.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@');
    console.log(`📡 Connecting to MongoDB: ${maskedUri}`);

    await mongoose.connect(mongoUri, {
      dbName: 'task_management_db',
      serverSelectionTimeoutMS: 10000
    });
    
    console.log('✅ Connected to MongoDB successfully.');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    throw error;
  }
};
