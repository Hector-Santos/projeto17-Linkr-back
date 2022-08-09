import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const { Pool } = pg;
const DATABASE_URL = process.env.DATABASE_URL || 'postgres://postgres:1606@localhost:5432/linkr';
const NODE_ENV = process.env.NODE_ENV || 'development';

const databaseConfig = {
    connectionString: DATABASE_URL
};

if(NODE_ENV === 'production') databaseConfig.ssl = { rejectUnauthorized: false };

const postgres = new Pool(databaseConfig);
await postgres.connect();

export default postgres;