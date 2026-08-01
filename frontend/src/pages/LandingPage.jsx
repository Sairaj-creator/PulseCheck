import { Link } from 'react-router-dom';

function LandingPage() {
  return (
    <main className="max-w-7xl mx-auto px-gutter py-stack-lg flex flex-col gap-32 h-screen overflow-y-auto bg-background text-on-background font-body-md antialiased overflow-x-hidden">
      {/* 1. Hero Section */}
      <section className="flex flex-col items-center justify-center text-center mt-24">
        <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full border border-outline-variant/30 bg-surface-container-low mb-8">
          <span className="w-2 h-2 rounded-full bg-secondary mr-2 shadow-[0_0_8px_rgba(78,222,163,0.8)] animate-pulse"></span>
          <span className="font-label-md text-label-md text-secondary">System Operational</span>
        </div>
        
        <h1 className="font-display text-display text-primary mb-6 max-w-3xl">PulseCheck</h1>
        
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mb-10">
          A containerized service-health dashboard with a resilient, automated CI/CD pipeline.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 mb-20">
          <Link 
            to="/dashboard"
            className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-inverse-primary text-white font-label-md text-label-md hover:bg-primary-container hover:text-on-primary-container transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
          >
            Live App (Demo)
          </Link>
          <a 
            href="https://github.com/Sairaj-creator/PulseCheck" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-6 py-3 rounded-lg border border-outline-variant bg-transparent text-on-surface hover:bg-surface-container hover:border-outline transition-colors focus:outline-none focus:ring-2 focus:ring-outline focus:ring-offset-2 focus:ring-offset-background"
          >
            <span className="material-symbols-outlined mr-2 text-lg">code</span>
            GitHub Repository
          </a>
        </div>
        
        <div className="w-full max-w-5xl rounded-xl border border-outline-variant/50 bg-surface-container-lowest p-2 shadow-2xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10 pointer-events-none"></div>
          <div className="flex items-center gap-2 px-4 py-2 bg-surface-container-low border-b border-outline-variant/50 rounded-t-lg">
            <div className="w-3 h-3 rounded-full bg-error"></div>
            <div className="w-3 h-3 rounded-full bg-tertiary-container"></div>
            <div className="w-3 h-3 rounded-full bg-secondary"></div>
          </div>
          <img 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDlRmIdRwkdcPfuCeqJ2g3yK4E3cp0tc0JJJOagSusWwe7vIn9Rh9W-ZQ8v0EtBJwGnc7EQgl1F0IQGN2mILtGv6N-NoFTWrfJ4LfSuYhNNsVDB-efctkHfBH3vAhMLRbSiVfIcVYrRRIuHcq6kUBlGyEaEui6C2yohutmNOfx55vZvwg9JGtyJsQBxMCJ43-D-O8A334PnrVbV_8VaQBHAFp7JhJfTb2IyqOShhZyK1ZA6saI2kWgj" 
            alt="PulseCheck Dashboard Screenshot" 
            className="w-full h-auto rounded-b-lg opacity-90 group-hover:opacity-100 transition-opacity duration-300"
          />
        </div>
      </section>

      {/* 2. Architecture & Pipeline Section */}
      <section className="max-w-4xl mx-auto w-full">
        <h2 className="font-headline-md text-headline-md text-primary mb-4 flex items-center">
          <span className="material-symbols-outlined mr-3 text-secondary">account_tree</span>
          Engineering Infrastructure
        </h2>
        <div className="bg-surface-container-low border border-outline-variant/30 rounded-lg p-container-padding relative overflow-hidden">
          <div className="absolute right-0 top-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-0"></div>
          <p className="font-body-lg text-body-lg text-on-surface-variant relative z-10">
            The infrastructure is built around a self-hosted Jenkins pipeline that safely builds, tests, and deploys the application with automated rollback capabilities.
          </p>
        </div>
      </section>

      {/* 3. Showcase Grid (Production Evidence) */}
      <section className="w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-stack-lg">
          {/* Card 1: Pipeline */}
          <div className="bg-surface-container hover:bg-surface-container-high border border-outline-variant/30 hover:border-outline-variant transition-colors duration-300 rounded-lg p-container-padding flex flex-col h-full group">
            <h3 className="font-headline-sm text-headline-sm text-on-surface mb-6 flex items-center justify-between">
              End-to-End Pipeline Run
              <span className="material-symbols-outlined text-secondary opacity-0 group-hover:opacity-100 transition-opacity">arrow_forward</span>
            </h3>
            
            <div className="bg-surface-dim rounded border border-outline-variant/20 p-4 font-label-md text-label-md flex-grow flex flex-col justify-center">
              <ul className="space-y-4">
                <li className="flex items-center text-on-surface-variant">
                  <span className="material-symbols-outlined text-secondary mr-3 text-base">check_circle</span>
                  <span className="text-secondary w-24">Lint</span>
                  <span className="text-outline text-xs">src/**/*.ts</span>
                </li>
                <li className="flex items-center text-on-surface-variant">
                  <span className="material-symbols-outlined text-secondary mr-3 text-base">check_circle</span>
                  <span className="text-secondary w-24">Test</span>
                  <span className="text-outline text-xs">coverage: 92%</span>
                </li>
                <li className="flex items-center text-on-surface-variant">
                  <span className="material-symbols-outlined text-secondary mr-3 text-base">check_circle</span>
                  <span className="text-secondary w-24">Build</span>
                  <span className="text-outline text-xs">docker build -t pulsecheck:latest</span>
                </li>
                <li className="flex items-center text-on-surface-variant">
                  <span className="material-symbols-outlined text-secondary mr-3 text-base">check_circle</span>
                  <span className="text-secondary w-24">Push</span>
                  <span className="text-outline text-xs">registry.internal:5000</span>
                </li>
                <li className="flex items-center text-on-surface">
                  <span className="material-symbols-outlined text-secondary mr-3 text-base animate-pulse">check_circle</span>
                  <span className="text-primary w-24 font-bold">Deploy</span>
                  <span className="text-primary text-xs">prod-cluster-01</span>
                </li>
              </ul>
            </div>
          </div>
          
          {/* Card 2: Rollback */}
          <div className="bg-surface-container hover:bg-surface-container-high border border-outline-variant/30 hover:border-outline-variant transition-colors duration-300 rounded-lg p-container-padding flex flex-col h-full group">
            <h3 className="font-headline-sm text-headline-sm text-on-surface mb-4">
              Automated Rollback in Action
            </h3>
            <p className="font-body-md text-body-md text-on-surface-variant mb-6">
              Guards against broken deployments. If a bad commit fails the <span className="font-label-sm text-primary bg-primary/10 px-1 rounded">/health</span> check, the system detects it, rolls back containers to the previous good SHA, and alerts via Slack.
            </p>
            
            <div className="bg-[#1e1e1e] rounded border border-outline-variant/20 p-4 font-label-md text-label-md flex-grow overflow-hidden relative">
              <div className="text-error mb-2">[ERROR] HEALTH CHECK FAILED. INITIATING ROLLBACK...</div>
              <div className="text-on-surface-variant mb-1">&gt; Stopping container pulsecheck_app_1</div>
              <div className="text-on-surface-variant mb-1">&gt; Reverting to SHA: 8f9a2b4</div>
              <div className="text-secondary mb-4">&gt; Rollback successful. Container running.</div>
              
              {/* Slack Mock */}
              <div className="mt-auto bg-surface-container-highest rounded p-3 border border-error-container/50 flex items-start gap-3">
                <div className="w-8 h-8 rounded bg-error-container flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-on-error-container text-sm">warning</span>
                </div>
                <div>
                  <div className="font-bold text-on-surface text-xs mb-1">Jenkins-Bot <span className="text-outline font-normal">14:32</span></div>
                  <div className="text-on-surface-variant text-xs">Deployment failed on prod. Auto-rollback triggered and completed.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Engineering Deep Dive */}
      <section className="max-w-4xl mx-auto w-full">
        <h2 className="font-headline-lg text-headline-lg text-on-surface mb-8 border-b border-outline-variant/30 pb-4">
          Engineering Deep Dive
        </h2>
        
        <div className="space-y-12">
          {/* Subsection 1 */}
          <div>
            <h3 className="font-headline-sm text-headline-sm text-primary mb-4 flex items-center">
              <span className="material-symbols-outlined mr-2 text-primary">bug_report</span>
              Hardest Problem Solved: Flaky Native Module Compilation
            </h3>
            <div className="prose prose-invert max-w-none text-on-surface-variant font-body-md leading-relaxed">
              <p>
                During the Build stage, compiling <code className="font-label-md text-tertiary bg-surface-container px-1 py-0.5 rounded">better-sqlite3</code> inside the Jenkins container consistently failed due to a <code className="font-label-md text-tertiary bg-surface-container px-1 py-0.5 rounded">node-gyp</code> network timeout. 
              </p>
              <p className="mt-4">
                Solved by migrating to a heavily optimized multi-stage Alpine Docker build (~200MB) and setting <code className="font-label-md text-secondary bg-surface-container px-1 py-0.5 rounded">npm_config_nodedir=/usr/local</code> to force <code className="font-label-md text-tertiary bg-surface-container px-1 py-0.5 rounded">node-gyp</code> to compile against local Alpine Node headers.
              </p>
            </div>
          </div>
          
          {/* Subsection 2 */}
          <div>
            <h3 className="font-headline-sm text-headline-sm text-primary mb-4 flex items-center">
              <span className="material-symbols-outlined mr-2 text-primary">balance</span>
              Architecture Tradeoffs: Deploy Downtime vs. Complexity
            </h3>
            <div className="prose prose-invert max-w-none text-on-surface-variant font-body-md leading-relaxed">
              <p>
                The <code className="font-label-md text-tertiary bg-surface-container px-1 py-0.5 rounded">deploy.sh</code> script fully stops the old stack before spinning up the new one (<code className="font-label-md text-outline bg-surface-container px-1 py-0.5 rounded">docker compose down &amp;&amp; docker compose up -d</code>). 
              </p>
              <p className="mt-4">
                For this project's scale, the ~5 second deploy downtime was accepted in favor of a much simpler, more reliable deploy/rollback script, avoiding the massive complexity overhead of zero-downtime blue/green deployments in a single-node Docker environment.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Getting Started (Terminal Style) */}
      <section className="max-w-3xl mx-auto w-full mb-32">
        <h2 className="font-headline-md text-headline-md text-on-surface mb-6">Local Setup</h2>
        <div className="bg-surface-dim rounded-lg border border-outline-variant/30 overflow-hidden shadow-lg">
          <div className="flex items-center gap-2 px-4 py-3 bg-surface-container-high border-b border-outline-variant/30">
            <span className="material-symbols-outlined text-outline text-sm">terminal</span>
            <span className="font-label-md text-label-md text-outline">bash</span>
          </div>
          <div className="p-6 font-label-md text-label-md text-on-surface-variant space-y-4">
            <div className="flex items-start">
              <span className="text-secondary select-none mr-4">$</span>
              <code className="text-on-surface">git clone https://github.com/Sairaj-creator/PulseCheck.git &amp;&amp; cd PulseCheck</code>
            </div>
            <div className="flex items-start">
              <span className="text-secondary select-none mr-4">$</span>
              <code className="text-on-surface">cp .env.example .env</code>
            </div>
            <div className="flex items-start">
              <span className="text-secondary select-none mr-4">$</span>
              <code className="text-on-surface">docker compose up -d</code>
            </div>
            <div className="text-outline mt-6 pt-4 border-t border-outline-variant/20 italic">
              # Services will be available at http://localhost:3000
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default LandingPage;
