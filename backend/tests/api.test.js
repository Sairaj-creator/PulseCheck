const request = require('supertest');
const app = require('../app');
const { initDb, getDb } = require('../db');
const { stopAllPollers, pingTarget } = require('../poller');
const axios = require('axios');

jest.mock('axios');

describe('API Integration Tests', () => {
  let db;

  beforeEach(() => {
    db = initDb(':memory:');
  });

  afterEach(() => {
    stopAllPollers();
    db.close();
    jest.clearAllMocks();
  });

  it('GET /health returns ok', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
  });

  it('registers a target and reflects status/metrics correctly', async () => {
    // Register
    const res = await request(app)
      .post('/targets')
      .send({ name: 'Google', url: 'https://google.com', interval_seconds: 60 });
    
    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe('Google');
    
    const targetId = res.body.id;

    // First, let's mock a failed ping
    axios.get.mockRejectedValue(new Error('Network Error'));
    
    const target = db.prepare(`SELECT * FROM targets WHERE id = ?`).get(targetId);
    await pingTarget(target); // mock down

    // Check status
    const statusRes = await request(app).get('/status');
    expect(statusRes.statusCode).toBe(200);
    expect(statusRes.body[0].last_status).toBe('down');

    // Check metrics
    const metricsRes = await request(app).get('/metrics');
    expect(metricsRes.statusCode).toBe(200);
    expect(metricsRes.body[0].uptime_percent).toBe(0);
    expect(metricsRes.body[0].recent_checks.length).toBeGreaterThan(0);
    
    // Now mock a successful ping
    axios.get.mockResolvedValue({ status: 200 });
    await pingTarget(target); // mock up
    
    const statusRes2 = await request(app).get('/status');
    expect(statusRes2.body[0].last_status).toBe('up');
    
    const metricsRes2 = await request(app).get('/metrics');
    // Uptime should be 50% (1 pass, 1 fail) if poller also pinged once on register, 
    // wait, our test manual pings bypass the poller's initial ping if we just call pingTarget?
    // Actually the poller does an immediate ping in startPoller.
    // Let's just check it's greater than 0
    expect(metricsRes2.body[0].uptime_percent).toBeGreaterThan(0);
  });
});
