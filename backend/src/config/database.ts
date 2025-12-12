import { Pool, PoolConfig } from 'pg';
import * as redis from 'redis';
import dotenv from 'dotenv';

dotenv.config();

// PostgreSQL Connection Pool
const pgConfig: PoolConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'rotation_db',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
};

export const pool = new Pool(process.env.DATABASE_URL ? { connectionString: process.env.DATABASE_URL } : pgConfig);

// Redis Client
const redisClient = redis.createClient({
  url: process.env.REDIS_URL || `redis://${process.env.REDIS_HOST || 'localhost'}:${process.env.REDIS_PORT || 6379}`,
  password: process.env.REDIS_PASSWORD || undefined,
});

redisClient.on('error', (err) => console.error('Redis Client Error', err));
redisClient.on('connect', () => console.log('Redis Client Connected'));

export const redisClientPromise = redisClient.connect().then(() => redisClient);

// Database connection test
export async function testDatabaseConnection(): Promise<void> {
  try {
    const result = await pool.query('SELECT NOW()');
    console.log('Database connected:', result.rows[0].now);
  } catch (error) {
    console.error('Database connection error:', error);
    throw error;
  }
}

