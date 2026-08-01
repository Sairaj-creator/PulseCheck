import { useState, useRef, useEffect } from 'react';

function Header({ metrics = [] }) {
  const [bellOpen, setBellOpen] = useState(false);
  const dropdownRef = useRef(null);

  const downTargets = metrics.filter(m => m.status === 'down');
  const offlineCount = downTargets.length;

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setBellOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Initials avatar from a fixed name
  const initials = 'SC';

  return (
    <header className="bg-surface dark:bg-surface text-primary dark:text-primary font-body-md text-body-md w-full h-16 border-b border-outline-variant flex justify-between items-center px-container-padding sticky top-0 z-10">
      <h2 className="font-headline-md text-headline-md font-bold text-on-surface">PulseCheck Dashboard</h2>
      
      <div className="flex items-center gap-stack-md">
        {/* Bell — live badge + dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            id="notifications-btn"
            onClick={() => setBellOpen(prev => !prev)}
            className="relative text-on-surface-variant hover:bg-surface-variant transition-colors p-unit rounded-full active:scale-95 duration-100"
            aria-label="Notifications"
          >
            <span className="material-symbols-outlined" style={offlineCount > 0 ? {fontVariationSettings: "'FILL' 1"} : {}}>
              {offlineCount > 0 ? 'notifications_active' : 'notifications'}
            </span>
            {offlineCount > 0 && (
              <span className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-error text-on-error text-[9px] font-bold flex items-center justify-center leading-none">
                {offlineCount}
              </span>
            )}
          </button>

          {bellOpen && (
            <div className="absolute right-0 top-12 w-72 bg-surface-container-high border border-outline-variant rounded-xl shadow-2xl z-50 overflow-hidden">
              <div className="px-4 py-3 border-b border-outline-variant flex items-center justify-between">
                <span className="font-headline-sm text-headline-sm text-on-surface">Alerts</span>
                {offlineCount === 0 && (
                  <span className="font-label-sm text-label-sm text-secondary flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">check_circle</span>All clear
                  </span>
                )}
              </div>
              <div className="max-h-64 overflow-y-auto">
                {offlineCount === 0 ? (
                  <div className="px-4 py-6 text-center text-on-surface-variant font-body-md">
                    All targets are up ✓
                  </div>
                ) : (
                  downTargets.map(t => (
                    <div key={t.id} className="px-4 py-3 border-b border-outline-variant/50 last:border-0 flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-error mt-1.5 shrink-0 pulse-dot-red"></div>
                      <div>
                        <p className="font-body-md text-on-surface font-medium">{t.name}</p>
                        <p className="font-label-sm text-label-sm text-on-surface-variant truncate max-w-[200px]">{t.url}</p>
                        <p className="font-label-sm text-label-sm text-error mt-0.5">DOWN · {t.uptime_percent.toFixed(1)}% uptime</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Help — links to GitHub README */}
        <a
          href="https://github.com/Sairaj-creator/PulseCheck/blob/main/README.md"
          target="_blank"
          rel="noopener noreferrer"
          className="text-on-surface-variant hover:bg-surface-variant transition-colors p-unit rounded-full active:scale-95 duration-100 flex items-center"
          aria-label="Documentation"
        >
          <span className="material-symbols-outlined">help</span>
        </a>
        
        {/* Initials avatar */}
        <div className="w-8 h-8 rounded-full bg-primary-container border border-primary-fixed-dim flex items-center justify-center ml-stack-sm shrink-0">
          <span className="font-label-md text-label-md text-on-primary-container font-bold">{initials}</span>
        </div>
      </div>
    </header>
  );
}

export default Header;
