const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'CowsForMPP',
  password: 'andreea12',
  port: 5432, 
});

module.exports = pool;
