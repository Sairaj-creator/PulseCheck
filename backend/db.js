const Database = require('better-sqlite3');
const path = require('path');

let db;

function initDb(dbPath = process.env.DB_PATH || 'pulsecheck.db') {
  if (dbPath === ':memory:') {
    db = new Database(':memory:');
  } else {
    const fullPath = path.resolve(__dirname, dbPath);
    db = new Database(fullPath);
  }
  
  db.pragma('journal_mode = WAL');

  db.exec(`
    CREATE TABLE IF NOT EXISTS targets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      url TEXT NOT NULL,
      interval_seconds INTEGER NOT NULL,
      last_status TEXT DEFAULT 'unknown'
    );
    
    CREATE TABLE IF NOT EXISTS checks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      target_id INTEGER NOT NULL,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      success BOOLEAN NOT NULL,
      response_time_ms INTEGER,
      FOREIGN KEY (target_id) REFERENCES targets (id) ON DELETE CASCADE
    );
  `);
  
  return db;
}

function getDb() {
  if (!db) {
    throw new Error('Database not initialized. Call initDb() first.');
  }
  return db;
}

module.exports = { initDb, getDb };
