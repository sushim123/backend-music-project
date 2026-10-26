import { Sequelize } from 'sequelize';

export const sequelize = new Sequelize(
  process.env.MYSQL_DATABASE || 'project_management_db',
  process.env.MYSQL_USER || 'root',
  process.env.MYSQL_PASSWORD || '',
  {
    host: process.env.MYSQL_HOST || 'localhost',
    port: Number(process.env.MYSQL_PORT) || 3306,
    dialect: 'mysql',
    logging: false,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

export const connectMySQL = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Connected to MySQL successfully.');
    await sequelize.sync();
    console.log('✅ MySQL tables synchronized.');
  } catch (error) {
    console.error('❌ MySQL connection error:', error.message);
    throw error;
  }
};
