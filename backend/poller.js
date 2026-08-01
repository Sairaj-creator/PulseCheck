const axios = require('axios');
const { getDb } = require('./db');

// Map of target_id -> interval ID
const activePollers = new Map();

async function notifySlack(target, newStatus) {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL;
  if (!webhookUrl) return; // Silent if no webhook configured

  const color = newStatus === 'down' ? '#FF0000' : '#00FF00';
  const text = newStatus === 'down' 
    ? `🚨 *ALERT*: Target *${target.name}* (${target.url}) is DOWN!` 
    : `✅ *RECOVERY*: Target *${target.name}* (${target.url}) is UP!`;

  try {
    await axios.post(webhookUrl, {
      attachments: [{ color, text }]
    });
  } catch (err) {
    console.error('Failed to notify Slack:', err.message);
  }
}

async function pingTarget(target) {
  const db = getDb();
  const start = Date.now();
  let success = false;
  let responseTimeMs = 0;

  try {
    const response = await axios.get(target.url, {
      timeout: 10000,
      maxRedirects: 5,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; PulseCheck/1.0; +https://github.com/Sairaj-creator/PulseCheck)'
      },
      validateStatus: (status) => status < 500  // treat 2xx/3xx/4xx as 'up', only 5xx is down
    });
    success = response.status < 500;
    responseTimeMs = Math.max(0, Date.now() - start);
  } catch (err) {
    success = false;
    responseTimeMs = Math.max(0, Math.min(Date.now() - start, 10000)); // clamp 0..timeout
  }

  // Record the check
  const stmt = db.prepare(`
    INSERT INTO checks (target_id, success, response_time_ms)
    VALUES (?, ?, ?)
  `);
  stmt.run(target.id, success ? 1 : 0, responseTimeMs);

  // Check for state transition
  const newStatus = success ? 'up' : 'down';
  if (target.last_status !== newStatus) {
    // State flipped
    const updateStmt = db.prepare(`UPDATE targets SET last_status = ? WHERE id = ?`);
    updateStmt.run(newStatus, target.id);
    
    if (target.last_status !== 'unknown') {
      await notifySlack(target, newStatus);
    }
    target.last_status = newStatus;
  }
}

function startPoller(target) {
  if (activePollers.has(target.id)) {
    return; // Already polling
  }
  
  // Ping immediately, then interval
  pingTarget(target);
  const intervalId = setInterval(() => {
    pingTarget(target);
  }, target.interval_seconds * 1000);
  
  activePollers.set(target.id, intervalId);
}

function stopPoller(targetId) {
  if (activePollers.has(targetId)) {
    clearInterval(activePollers.get(targetId));
    activePollers.delete(targetId);
  }
}

function startAllPollers() {
  const db = getDb();
  const targets = db.prepare(`SELECT * FROM targets`).all();
  for (const t of targets) {
    startPoller(t);
  }
}

function stopAllPollers() {
  for (const [, intervalId] of activePollers.entries()) {
    clearInterval(intervalId);
  }
  activePollers.clear();
}

module.exports = { startPoller, stopPoller, startAllPollers, stopAllPollers, pingTarget };
