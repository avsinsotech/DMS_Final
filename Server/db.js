// D:\DMS Project\Server\db.js
const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  host:                    process.env.DB_HOST,
  port:                    parseInt(process.env.DB_PORT),
  database:                process.env.DB_NAME,
  user:                    process.env.DB_USER,
  password:                process.env.DB_PASSWORD,
  max:                     10,
  idleTimeoutMillis:       30000,
  connectionTimeoutMillis: 5000,
});

// Test connection on startup
pool.connect((err, client, release) => {
  if (err) {
    console.error("❌ PostgreSQL connection failed:", err.message);
    console.error("   Check: IP, port, password, pg_hba.conf");
  } else {
    console.log(`✅ PostgreSQL connected → ${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`);
    release();
  }
});

module.exports = pool;
