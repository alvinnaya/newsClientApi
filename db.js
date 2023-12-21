const { Pool,Client } = require('pg');

const dotenv = require('dotenv');

dotenv.config();
// const pool = new Pool({
//   user: 'postgres',
//   host: 'localhost',
//   database: 'postgres',
//   password: 'Rielia13',
//   port: 5432,
// });

// const pool = new Client("postgresql://alvian:pX3gsnBameIpNViEPDbMBw@direct-tapir-7666.8nk.cockroachlabs.cloud:26257/project_f?sslmode=verify-full");
const pool = new Client(process.env.DATABASE_URL);
module.exports = pool;
