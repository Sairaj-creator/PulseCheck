require('dotenv').config();
const app = require('./app');
const { initDb } = require('./db');
const { startAllPollers } = require('./poller');

const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 4000;
const dbPath = process.env.DB_PATH || 'pulsecheck.db';

// Ensure data directory exists if dbPath is in a subdirectory
const dbDir = path.dirname(dbPath);
if (dbDir && dbDir !== '.' && !fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Initialize DB and start polling
initDb(dbPath);
startAllPollers();

app.listen(PORT, () => {
  console.log(`Backend listening on port ${PORT}`);
});
