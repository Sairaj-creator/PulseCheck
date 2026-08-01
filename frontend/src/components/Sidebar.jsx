import { Link, useLocation } from 'react-router-dom';

function Sidebar() {
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', icon: 'dashboard', path: '/dashboard' },
  ];

  const disabledItems = [
    { name: 'Incidents', icon: 'warning' },
    { name: 'Metrics', icon: 'insights' },
    { name: 'Infrastructure', icon: 'dns' },
    { name: 'Alerts', icon: 'notifications_active' },
  ];

  return (
    <nav className="bg-surface-container dark:bg-surface-container text-secondary dark:text-secondary font-label-md text-label-md fixed left-0 top-0 h-full w-60 border-r border-outline-variant flex flex-col py-stack-md z-20">
      <div className="px-container-padding mb-stack-lg flex items-center gap-stack-sm">
        <span className="material-symbols-outlined font-headline-md text-headline-md font-bold text-on-surface">dns</span>
        <div>
          <h1 className="font-headline-sm text-headline-sm font-bold text-on-surface">PulseCheck</h1>
          <p className="font-label-sm text-label-sm text-on-surface-variant">Global Monitoring</p>
        </div>
      </div>
      
      <div className="flex-1 flex flex-col gap-unit px-gutter">
        {navItems.map((item, idx) => {
          const isActive = location.pathname === item.path;
          return (
            <Link 
              key={idx}
              to={item.path} 
              className={`flex items-center gap-stack-sm px-gutter py-stack-sm rounded-lg cursor-pointer duration-200 transition-all ${isActive ? 'bg-primary-container text-on-primary-container' : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-variant'}`}
            >
              <span className="material-symbols-outlined" style={isActive ? {fontVariationSettings: "'FILL' 1"} : {}}>{item.icon}</span>
              {item.name}
            </Link>
          );
        })}

        <div className="mt-stack-sm border-t border-outline-variant/30 pt-stack-sm">
          <p className="font-label-sm text-label-sm text-on-surface-variant/50 px-gutter mb-unit uppercase tracking-widest">Coming Soon</p>
          {disabledItems.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between gap-stack-sm px-gutter py-stack-sm rounded-lg opacity-40 cursor-not-allowed select-none"
              title="Not yet implemented"
            >
              <div className="flex items-center gap-stack-sm text-on-surface-variant">
                <span className="material-symbols-outlined">{item.icon}</span>
                {item.name}
              </div>
              <span className="font-label-sm text-label-sm text-outline bg-surface-container-highest px-1.5 py-0.5 rounded-full text-[9px] tracking-wide">SOON</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-unit px-gutter mt-auto pt-stack-md border-t border-outline-variant">
        <a 
          href="https://github.com/Sairaj-creator/PulseCheck/blob/main/README.md" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-stack-sm px-gutter py-stack-sm text-on-surface-variant hover:text-on-surface hover:bg-surface-variant transition-all rounded-lg cursor-pointer duration-200"
        >
          <span className="material-symbols-outlined">description</span>
          Docs
        </a>
        <a 
          href="https://github.com/Sairaj-creator/PulseCheck/issues" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-stack-sm px-gutter py-stack-sm text-on-surface-variant hover:text-on-surface hover:bg-surface-variant transition-all rounded-lg cursor-pointer duration-200"
        >
          <span className="material-symbols-outlined">contact_support</span>
          Support
        </a>
      </div>
    </nav>
  );
}

export default Sidebar;
