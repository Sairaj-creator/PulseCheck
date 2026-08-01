import { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

const API_BASE = 'http://localhost:3000'; // Or rely on Vite proxy if setup

function Dashboard() {
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

  const onlineCount = metrics.filter(m => m.status === 'up').length;
  const offlineCount = metrics.filter(m => m.status === 'down').length;

  return (
    <div className="bg-background text-on-surface font-body-md h-screen flex overflow-hidden">
      <Sidebar />
      <main className="ml-60 flex-1 flex flex-col h-full bg-background overflow-y-auto">
        <Header />
        
        <div className="p-container-padding flex-1 flex flex-col gap-stack-lg max-w-7xl mx-auto w-full">
          {/* Add Target Card */}
          <section className="bg-surface-container-high rounded-xl border border-outline-variant overflow-hidden transition-colors duration-200 hover:border-outline">
            <div className="px-container-padding py-stack-sm border-b border-outline-variant bg-surface-container/50">
              <h3 className="font-headline-sm text-headline-sm text-on-surface">Add Target</h3>
            </div>
            
            <div className="p-container-padding">
              <form onSubmit={handleAddTarget} className="flex flex-col md:flex-row gap-gutter items-end">
                <div className="flex-1 w-full flex flex-col gap-unit">
                  <label className="font-label-sm text-label-sm text-on-surface-variant">Name (e.g. Google)</label>
                  <input 
                    type="text" 
                    placeholder="Service Name"
                    className="w-full bg-surface-container-lowest border border-outline-variant rounded-md px-stack-sm py-2 text-on-surface font-body-md focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all placeholder:text-on-surface-variant/50"
                    value={newTarget.name}
                    onChange={e => setNewTarget({...newTarget, name: e.target.value})}
                    required
                  />
                </div>
                
                <div className="flex-[2] w-full flex flex-col gap-unit">
                  <label className="font-label-sm text-label-sm text-on-surface-variant">URL (e.g. https://google.com)</label>
                  <input 
                    type="url" 
                    placeholder="https://" 
                    className="w-full bg-surface-container-lowest border border-outline-variant rounded-md px-stack-sm py-2 text-on-surface font-body-md focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all placeholder:text-on-surface-variant/50"
                    value={newTarget.url}
                    onChange={e => setNewTarget({...newTarget, url: e.target.value})}
                    required
                  />
                </div>
                
                <div className="w-full md:w-32 flex flex-col gap-unit">
                  <label className="font-label-sm text-label-sm text-on-surface-variant">Interval (s)</label>
                  <input 
                    type="number" 
                    className="w-full bg-surface-container-lowest border border-outline-variant rounded-md px-stack-sm py-2 text-on-surface font-label-md focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all"
                    value={newTarget.interval_seconds}
                    onChange={e => setNewTarget({...newTarget, interval_seconds: e.target.value})}
                    required
                    min="5"
                  />
                </div>
                
                <button type="submit" className="w-full md:w-auto bg-primary-container text-on-primary-container hover:bg-primary transition-colors px-container-padding py-2 rounded-md font-body-md font-medium whitespace-nowrap active:scale-95 duration-100 border border-primary-fixed-dim shadow-[0_0_12px_rgba(128,131,255,0.2)] hover:shadow-[0_0_16px_rgba(128,131,255,0.4)]">
                  Add Target
                </button>
              </form>
            </div>
          </section>

          {/* Monitored Targets Card */}
          <section className="bg-surface-container-high rounded-xl border border-outline-variant overflow-hidden flex-1 flex flex-col">
            <div className="px-container-padding py-stack-sm border-b border-outline-variant bg-surface-container/50 flex justify-between items-center">
              <h3 className="font-headline-sm text-headline-sm text-on-surface">Monitored Targets</h3>
              <div className="flex items-center gap-stack-sm text-on-surface-variant">
                <span className="font-label-sm text-label-sm flex items-center gap-unit"><div className="w-2 h-2 rounded-full bg-secondary"></div> {onlineCount} Online</span>
                <span className="font-label-sm text-label-sm flex items-center gap-unit"><div className="w-2 h-2 rounded-full bg-error"></div> {offlineCount} Offline</span>
              </div>
            </div>
            
            <div className="w-full overflow-x-auto flex-1">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-outline-variant bg-surface-container/30">
                    <th className="py-stack-sm px-gutter font-label-sm text-label-sm text-on-surface-variant w-16 text-center">Status</th>
                    <th className="py-stack-sm px-gutter font-label-sm text-label-sm text-on-surface-variant">Name</th>
                    <th className="py-stack-sm px-gutter font-label-sm text-label-sm text-on-surface-variant text-right">Uptime (Last 100)</th>
                    <th className="py-stack-sm px-gutter font-label-sm text-label-sm text-on-surface-variant text-right">Avg Response (ms)</th>
                    <th className="py-stack-sm px-gutter font-label-sm text-label-sm text-on-surface-variant w-48">Recent Responses</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant">
                  {metrics.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="py-stack-lg text-center text-on-surface-variant font-body-md">
                        No targets registered yet. Add one above to start monitoring.
                      </td>
                    </tr>
                  ) : (
                    metrics.map(target => {
                      const isUp = target.status === 'up';
                      return (
                        <tr key={target.id} className="hover:bg-surface-variant/50 transition-colors group">
                          <td className="py-stack-md px-gutter text-center">
                            <div className={`w-3 h-3 rounded-full mx-auto ${isUp ? 'bg-secondary pulse-dot-green' : 'bg-error pulse-dot-red'}`}></div>
                          </td>
                          <td className="py-stack-md px-gutter">
                            <div className={`font-body-md text-on-surface font-medium transition-colors ${isUp ? 'group-hover:text-primary' : 'group-hover:text-error'}`}>{target.name}</div>
                            <div className="font-label-sm text-label-sm text-on-surface-variant truncate max-w-xs">{target.url}</div>
                          </td>
                          <td className="py-stack-md px-gutter text-right">
                            <span className={`font-label-md text-label-md ${isUp ? 'text-secondary' : 'text-error'}`}>
                              {target.uptime_percent.toFixed(2)}%
                            </span>
                          </td>
                          <td className="py-stack-md px-gutter text-right">
                            <span className={`font-label-md text-label-md ${isUp ? 'text-on-surface' : 'text-error'}`}>
                              {target.avg_response_time_ms.toFixed(0)} ms
                            </span>
                          </td>
                          <td className="py-stack-md px-gutter">
                            <div className="flex items-end gap-1 h-8 w-full">
                              {target.recent_checks.slice(0, 10).map((time, idx) => {
                                if (time === null || !isUp && idx === target.recent_checks.length -1) {
                                  return <div key={idx} className="flex-1 bg-surface-container-highest h-full rounded-sm" title="failed"></div>;
                                }
                                // Sparkline logic: normalize 0-500ms to 20%-100% height
                                const heightPercent = Math.max(20, Math.min(100, (time / 200) * 100));
                                return (
                                  <div 
                                    key={idx} 
                                    className={`flex-1 ${isUp ? 'bg-secondary/80 hover:bg-secondary' : 'bg-error/80 hover:bg-error'} rounded-sm transition-colors`}
                                    style={{ height: `${heightPercent}%` }}
                                    title={`${time}ms`}
                                  />
                                );
                              })}
                              {/* Pad with empty bars if less than 10 recent checks */}
                              {Array.from({ length: Math.max(0, 10 - target.recent_checks.length) }).map((_, idx) => (
                                <div key={`empty-${idx}`} className="flex-1 bg-surface-container-highest/20 h-full rounded-sm"></div>
                              ))}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
