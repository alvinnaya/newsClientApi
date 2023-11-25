const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'news',
  password: 'rielia13',
  port: 5432,
});

module.exports = pool;
