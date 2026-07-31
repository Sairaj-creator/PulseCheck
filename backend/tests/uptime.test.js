const { initDb } = require('../db');

describe('Uptime Calculation Logic', () => {
  let db;

  beforeEach(() => {
    db = initDb(':memory:');
    // Insert a dummy target
    db.prepare(`INSERT INTO targets (name, url, interval_seconds) VALUES ('test', 'http://test', 10)`).run();
  });

  afterEach(() => {
    db.close();
  });

  function insertChecks(targetId, checks) {
    const stmt = db.prepare(`INSERT INTO checks (target_id, success, response_time_ms) VALUES (?, ?, ?)`);
    for (const check of checks) {
      stmt.run(targetId, check.success ? 1 : 0, check.time || 100);
    }
  }

  function getMetrics(targetId) {
    const checks = db.prepare(`SELECT success, response_time_ms FROM checks WHERE target_id = ? ORDER BY timestamp DESC LIMIT 100`).all(targetId);
    let uptime_percent = 0;
    if (checks.length > 0) {
      const passed = checks.filter(c => c.success === 1).length;
      uptime_percent = (passed / checks.length) * 100;
    }
    return uptime_percent;
  }

  it('calculates 100% uptime for all-pass', () => {
    insertChecks(1, [{success: true}, {success: true}, {success: true}]);
    expect(getMetrics(1)).toBe(100);
  });

  it('calculates 0% uptime for all-fail', () => {
    insertChecks(1, [{success: false}, {success: false}]);
    expect(getMetrics(1)).toBe(0);
  });

  it('calculates 50% uptime for mixed', () => {
    insertChecks(1, [{success: true}, {success: false}, {success: true}, {success: false}]);
    expect(getMetrics(1)).toBe(50);
  });

  it('calculates 0% for empty window', () => {
    expect(getMetrics(1)).toBe(0);
  });
});
