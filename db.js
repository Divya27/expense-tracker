const mysql2 = require('mysql2');
require('dotenv').config();

const pool = mysql2.createPool({
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
  waitForConnections: true,
  connectionLimit: 10,
});

module.exports = pool.promise();