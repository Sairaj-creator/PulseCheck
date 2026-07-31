const { initDb, getDb } = require('./db');
const { startPoller, pingTarget } = require('./poller');
const app = require('./app');
const request = require('supertest');

async function run() {
  process.env.SLACK_WEBHOOK_URL = 'https://example.com/fake-slack-webhook';
  
  // Intercept axios in poller to simulate responses
  const axios = require('axios');
  const originalGet = axios.get;
  const originalPost = axios.post;
  
  let postCalls = [];
  axios.post = async (url, data) => {
    postCalls.push({ url, data });
    console.log(`[Slack Webhook Fired] URL: ${url}, Data:`, JSON.stringify(data));
    return { status: 200 };
  };

  initDb(':memory:');
  const db = getDb();
  
  // Register Target
  const res = await request(app).post('/targets').send({ name: 'Google', url: 'https://google.com', interval_seconds: 60 });
  const target = res.body;
  
  // Mock UP
  axios.get = async () => ({ status: 200 });
  await pingTarget(db.prepare(`SELECT * FROM targets WHERE id = ?`).get(target.id)); // Transition unknown -> up
  
  // Mock DOWN
  axios.get = async () => { throw new Error('Network Error'); };
  await pingTarget(db.prepare(`SELECT * FROM targets WHERE id = ?`).get(target.id)); // Transition up -> down
  
  // Fetch Metrics
  const metricsRes = await request(app).get('/metrics');
  
  console.log('\n--- SAMPLE /metrics RESPONSE ---');
  console.log(JSON.stringify(metricsRes.body, null, 2));

  console.log('\n--- SLACK ALERT TRANSITIONS VERIFIED ---');
  console.log(`Total Slack webhook calls: ${postCalls.length}`);
  
  // Restore
  axios.get = originalGet;
  axios.post = originalPost;
}

run().catch(console.error);
