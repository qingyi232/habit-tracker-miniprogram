const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function init() {
  const conn = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    multipleStatements: true,
    charset: 'utf8mb4'
  });

  const sql = fs.readFileSync(path.join(__dirname, 'db', 'init.sql'), 'utf8');
  await conn.query(sql);
  console.log('Database initialized successfully!');
  await conn.end();
}

init().catch(err => {
  console.error('Database init failed:', err.message);
  console.log('Please check MySQL connection settings (host: localhost, user: root, password: root)');
  process.exit(1);
});
