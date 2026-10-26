import 'dotenv/config';
import app from './src/app.js';
import { connectMySQL } from './src/config/db.mysql.js';
import { connectMongo } from './src/config/db.mongo.js';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    console.log('🔄 Initializing database connections...');
    
    
    await connectMySQL();

    // Connect to MongoDB (for Tasks)
    await connectMongo();

    // Start Express HTTP Server
    app.listen(PORT, () => {
      console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
      console.log(`🔗 API Base URL: http://localhost:${PORT}/api`);
      console.log(`🩺 Health Check: http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();
