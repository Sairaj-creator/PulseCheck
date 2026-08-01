function Header() {
  return (
    <header className="bg-surface dark:bg-surface text-primary dark:text-primary font-body-md text-body-md w-full h-16 border-b border-outline-variant flex justify-between items-center px-container-padding sticky top-0 z-10">
      <h2 className="font-headline-md text-headline-md font-bold text-on-surface">PulseCheck Dashboard</h2>
      
      <div className="flex items-center gap-stack-md">
        <button className="text-on-surface-variant hover:bg-surface-variant transition-colors p-unit rounded-full active:scale-95 duration-100">
          <span className="material-symbols-outlined">notifications</span>
        </button>
        <button className="text-on-surface-variant hover:bg-surface-variant transition-colors p-unit rounded-full active:scale-95 duration-100">
          <span className="material-symbols-outlined">settings</span>
        </button>
        <button className="text-on-surface-variant hover:bg-surface-variant transition-colors p-unit rounded-full active:scale-95 duration-100">
          <span className="material-symbols-outlined">help</span>
        </button>
        
        <div className="w-8 h-8 rounded-full bg-surface-container-highest border border-outline-variant overflow-hidden ml-stack-sm">
          <img 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuD1Y5XmMeXzbJQFVBjmFiy1Fi26qya16fpnIwpxmNppOJRNWmfRzqXcyjPsx1r7xudjwws7OPiBQapjokM-bmOSFkXAC0T6o1YgR47RwSkH-BwEgpq0efGTyZeJw2KfeipweS75S_KNhyfs_5chaBPhKgXs6XvC_q_kP6KPncm25MRh8Ljjs65LUaEZsqJKZN1hIXNTXFnieAoxtjn90p6u_yMOSCJyb0wMi2BULYy-rSwA9DuZVE70" 
            alt="User profile" 
            className="w-full h-full object-cover" 
          />
        </div>
      </div>
    </header>
  );
}

export default Header;
