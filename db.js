const { Pool,Client } = require('pg');

const dotenv = require('dotenv');

dotenv.config();

const pool = new Client(process.env.DATABASE_URL);
module.exports = pool;
