import { useState, useEffect } from 'react';
import axios from 'axios';
import './index.css';

const API_BASE = 'http://localhost:3000';

function App() {
  const [metrics, setMetrics] = useState([]);
  const [newTarget, setNewTarget] = useState({ name: '', url: '', interval_seconds: 60 });

  const fetchMetrics = async () => {
    try {
      const res = await axios.get(`${API_BASE}/metrics`);
      setMetrics(res.data);
    } catch (err) {
      console.error('Failed to fetch metrics', err);
    }
  };

  useEffect(() => {
    fetchMetrics();
    const interval = setInterval(fetchMetrics, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleAddTarget = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE}/targets`, {
        ...newTarget,
        interval_seconds: parseInt(newTarget.interval_seconds, 10)
      });
      setNewTarget({ name: '', url: '', interval_seconds: 60 });
      fetchMetrics();
    } catch {
      alert('Failed to add target');
    }
  };

  const getStatusColor = (status) => {
    if (status === 'up') return '#10B981'; // Green
    if (status === 'down') return '#EF4444'; // Red
    return '#9CA3AF'; // Gray
  };

  return (
    <div className="container">
      <header>
        <h1>PulseCheck Dashboard</h1>
      </header>

      <section className="add-target-section">
        <h2>Add Target</h2>
        <form onSubmit={handleAddTarget}>
          <input 
            type="text" 
            placeholder="Name (e.g. Google)" 
            value={newTarget.name}
            onChange={e => setNewTarget({...newTarget, name: e.target.value})}
            required
          />
          <input 
            type="url" 
            placeholder="URL (e.g. https://google.com)" 
            value={newTarget.url}
            onChange={e => setNewTarget({...newTarget, url: e.target.value})}
            required
          />
          <input 
            type="number" 
            placeholder="Interval (s)" 
            value={newTarget.interval_seconds}
            onChange={e => setNewTarget({...newTarget, interval_seconds: e.target.value})}
            required
            min="5"
          />
          <button type="submit">Add Target</button>
        </form>
      </section>

      <section className="targets-section">
        <h2>Monitored Targets</h2>
        {metrics.length === 0 ? (
          <p>No targets registered yet.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Status</th>
                <th>Name</th>
                <th>Uptime (Last 100)</th>
                <th>Avg Response (ms)</th>
                <th>Recent Responses</th>
              </tr>
            </thead>
            <tbody>
              {metrics.map(target => (
                <tr key={target.id}>
                  <td>
                    <span 
                      className="status-dot" 
                      style={{ backgroundColor: getStatusColor(target.status) }}
                    ></span>
                    {target.status.toUpperCase()}
                  </td>
                  <td>{target.name}</td>
                  <td>{target.uptime_percent.toFixed(2)}%</td>
                  <td>{target.avg_response_time_ms.toFixed(0)} ms</td>
                  <td>
                    <div className="sparkline">
                      {target.recent_checks.slice(0, 20).map((time, idx) => {
                        const height = Math.min(Math.max(time / 10, 2), 24);
                        return (
                          <div 
                            key={idx} 
                            className="sparkline-bar" 
                            style={{ height: `${height}px` }} 
                            title={`${time}ms`}
                          />
                        );
                      })}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}

export default App;
