const express = require('express');
const cors = require('cors');
const { getDb } = require('./db');
const { startPoller } = require('./poller');

const app = express();
app.use(express.json());
app.use(cors());

// Liveness check for the app itself (DELIBERATELY BROKEN FOR ROLLBACK TEST)
app.get('/health', (req, res) => {
  res.status(500).json({ status: 'broken' });
});

// Register a URL to monitor
app.post('/targets', (req, res) => {
  const { name, url, interval_seconds } = req.body;
  if (!name || !url || !interval_seconds) {
    return res.status(400).json({ error: 'Missing name, url, or interval_seconds' });
  }

  const db = getDb();
  const stmt = db.prepare(`
    INSERT INTO targets (name, url, interval_seconds, last_status)
    VALUES (?, ?, ?, 'unknown')
  `);
  
  const info = stmt.run(name, url, interval_seconds);
  const newTarget = db.prepare(`SELECT * FROM targets WHERE id = ?`).get(info.lastInsertRowid);
  
  startPoller(newTarget);

  res.status(201).json(newTarget);
});

// Current up/down state of all targets
app.get('/status', (req, res) => {
  const db = getDb();
  const targets = db.prepare(`SELECT id, name, url, last_status FROM targets`).all();
  res.json(targets);
});

// Uptime % and avg response time per target
app.get('/metrics', (req, res) => {
  const db = getDb();
  
  // Get all targets
  const targets = db.prepare(`SELECT * FROM targets`).all();
  
  const metrics = targets.map(target => {
    // Get last 100 checks
    const checks = db.prepare(`
      SELECT success, response_time_ms 
      FROM checks 
      WHERE target_id = ? 
      ORDER BY timestamp DESC 
      LIMIT 100
    `).all(target.id);
    
    let uptime_percent = 0;
    let avg_response_time_ms = 0;
    let recent_checks = checks.map(c => c.response_time_ms).reverse();

    if (checks.length > 0) {
      const passed = checks.filter(c => c.success === 1).length;
      uptime_percent = (passed / checks.length) * 100;
      
      const totalTime = checks.reduce((sum, c) => sum + c.response_time_ms, 0);
      avg_response_time_ms = totalTime / checks.length;
    }

    return {
      id: target.id,
      name: target.name,
      uptime_percent,
      avg_response_time_ms,
      recent_checks,
      status: target.last_status
    };
  });

  res.json(metrics);
});

module.exports = app;
