import Link from 'next/link';
import { auth } from '@/lib/auth';

export default async function HomePage() {
  const session = await auth();
  const isLoggedIn = !!session?.user;
  const role = session?.user?.role?.toLowerCase() || 'buyer';
  const dashboardLink = isLoggedIn ? `/dashboard/${role}` : '/login';

  return (
    <div className="bg-gradient-to-b from-gray-950 via-slate-950 to-gray-950 min-h-screen w-full relative">
      {/* ─── Hero Section ─────────────────────────────────────────────────── */}
      <section className="relative py-20 md:py-32 lg:py-40 w-full flex items-center justify-center overflow-hidden border-b border-slate-900/50">
        {/* Enhanced animated gradient background */}
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 opacity-40"
            style={{
              background:
                'radial-gradient(ellipse at 20% 50%, rgba(16, 185, 129, 0.2) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(6, 182, 212, 0.15) 0%, transparent 50%), radial-gradient(ellipse at 50% 80%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)',
            }}
          />
          {/* Subtle noise texture */}
          <div 
            className="absolute inset-0 opacity-[0.02]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
              backgroundSize: '200px 200px',
            }}
          />
        </div>

        {/* Enhanced grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '80px 80px',
            maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 70%)',
          }}
        />

        {/* Enhanced floating decorative elements with glow */}
        <div className="absolute top-[15%] left-[10%] w-3 h-3 rounded-full bg-emerald-400/40 blur-[2px] animate-float shadow-lg shadow-emerald-400/20" />
        <div className="absolute top-[30%] right-[15%] w-4 h-4 rounded-full bg-cyan-400/30 blur-[2px] animate-float shadow-lg shadow-cyan-400/20" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-[25%] left-[20%] w-2.5 h-2.5 rounded-full bg-purple-400/35 blur-[2px] animate-float shadow-lg shadow-purple-400/20" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-[15%] right-[25%] w-3.5 h-3.5 rounded-full bg-emerald-400/30 blur-[2px] animate-float shadow-lg shadow-emerald-400/20" style={{ animationDelay: '0.5s' }} />

        {/* Enhanced molecule decoration */}
        <svg className="absolute top-[15%] right-[8%] w-40 h-40 text-emerald-500/8 animate-float hidden md:block" style={{ animationDelay: '1.5s' }} viewBox="0 0 100 100">
          <circle cx="50" cy="20" r="8" fill="currentColor" stroke="currentColor" strokeWidth="0.5" />
          <circle cx="25" cy="65" r="8" fill="currentColor" stroke="currentColor" strokeWidth="0.5" />
          <circle cx="75" cy="65" r="8" fill="currentColor" stroke="currentColor" strokeWidth="0.5" />
          <line x1="50" y1="28" x2="30" y2="58" stroke="currentColor" strokeWidth="2.5" />
          <line x1="50" y1="28" x2="70" y2="58" stroke="currentColor" strokeWidth="2.5" />
          <line x1="33" y1="65" x2="67" y2="65" stroke="currentColor" strokeWidth="2.5" />
        </svg>

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          {/* Enhanced Logo / Brand */}
          <div className="animate-slideUp mb-6">
            <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 backdrop-blur-sm mb-6 hover:border-emerald-500/50 transition-all duration-300">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400"></span>
              </span>
              <span className="text-sm text-emerald-300 font-semibold tracking-wide">
                B2B Chemical & Pharmaceutical Platform
              </span>
            </div>
          </div>

          <h1
            className="text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tight mb-6 animate-slideUp"
            style={{ animationDelay: '100ms' }}
          >
            <span className="text-slate-100">Aasa</span>
            <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent font-extrabold">
              MedChem
            </span>
            <div className="text-xl sm:text-2xl lg:text-3xl font-medium text-slate-500 mt-3 tracking-wide">Precision-First Platform</div>
          </h1>

          <p
            className="text-base sm:text-lg lg:text-xl text-slate-400 max-w-2xl mx-auto mb-6 animate-slideUp leading-relaxed"
            style={{ animationDelay: '200ms' }}
          >
            Precision-first procurement for chemicals and pharmaceuticals.
            Where every <span className="text-emerald-400 font-semibold relative inline-block">
              0.001 mg
              <span className="absolute bottom-0 left-0 w-full h-[1px] bg-emerald-400/30"></span>
            </span> matters.
          </p>

          <p
            className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto mb-10 animate-slideUp"
            style={{ animationDelay: '250ms' }}
          >
            Manage quotations, orders, and inventory with pharma-grade accuracy.
            Built for buyers, sellers, and administrators.
          </p>

          {/* Enhanced CTA Buttons */}
          <div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slideUp"
            style={{ animationDelay: '350ms' }}
          >
            <Link
              href={dashboardLink}
              className="group relative flex items-center gap-3 px-8 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-2xl hover:from-emerald-500 hover:to-teal-500 transition-all duration-300 shadow-xl shadow-emerald-900/40 hover:shadow-2xl hover:shadow-emerald-900/60 hover:-translate-y-1 overflow-hidden w-full sm:w-auto justify-center"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
              <svg className="w-5 h-5 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              <span className="relative z-10">{isLoggedIn ? 'Go to Dashboard' : 'Sign In to Dashboard'}</span>
            </Link>
            <a
              href="#features"
              className="group flex items-center gap-3 px-8 py-3.5 border border-slate-700 text-slate-300 font-medium rounded-2xl hover:border-emerald-600/50 hover:bg-white/5 hover:text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-emerald-900/20 w-full sm:w-auto justify-center"
            >
              Learn More
              <svg className="w-5 h-5 group-hover:translate-y-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </a>
          </div>

          {/* Enhanced Test credentials hint */}
          {!isLoggedIn && (
            <div
              className="mt-12 inline-block animate-slideUp w-full max-w-xl mx-auto"
              style={{ animationDelay: '450ms' }}
            >
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-300" />
                <div className="relative bg-slate-900/80 rounded-2xl px-6 py-5 backdrop-blur-xl border border-white/10">
                  <div className="flex items-center gap-2 mb-3 justify-center">
                    <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                    </svg>
                    <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Demo Credentials</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="group/card">
                      <div className="flex items-center gap-1.5 mb-1.5 justify-center">
                        <span className="badge badge-admin text-[9px] px-1.5 py-0.5">Admin</span>
                      </div>
                      <p className="text-slate-300 font-mono text-[11px] bg-slate-800/50 rounded-lg px-2.5 py-1.5 border border-slate-700/50 group-hover/card:border-emerald-500/30 transition-colors truncate">
                        admin@aasamedchem.com
                      </p>
                    </div>
                    <div className="group/card">
                      <div className="flex items-center gap-1.5 mb-1.5 justify-center">
                        <span className="badge badge-seller text-[9px] px-1.5 py-0.5">Seller</span>
                      </div>
                      <p className="text-slate-300 font-mono text-[11px] bg-slate-800/50 rounded-lg px-2.5 py-1.5 border border-slate-700/50 group-hover/card:border-cyan-500/30 transition-colors truncate">
                        seller@chemco.com
                      </p>
                    </div>
                    <div className="group/card">
                      <div className="flex items-center gap-1.5 mb-1.5 justify-center">
                        <span className="badge badge-buyer text-[9px] px-1.5 py-0.5">Buyer</span>
                      </div>
                      <p className="text-slate-300 font-mono text-[11px] bg-slate-800/50 rounded-lg px-2.5 py-1.5 border border-slate-700/50 group-hover/card:border-purple-500/30 transition-colors truncate">
                        buyer@pharma.com
                      </p>
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-2 text-center">
                    Password pattern: <span className="text-slate-400 font-mono">Role@123</span>
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ─── Features Section ─────────────────────────────────────────────── */}
      <section id="features" className="relative py-20 px-6 border-b border-slate-900/50">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-900/5 to-transparent pointer-events-none" />
        
        <div className="relative max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span className="text-sm text-emerald-300 font-medium">Core Features</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold mb-6 text-slate-100">
              Built for <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent font-extrabold">Precision</span>
            </h2>
            <p className="text-base text-slate-400 max-w-2xl mx-auto">
              Every feature designed for the demanding requirements of chemical and pharmaceutical procurement.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 stagger-children">
            {/* Feature 1 */}
            <div className="group relative flex flex-col h-full">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500" />
              <div className="relative rounded-2xl border border-slate-800 bg-gradient-to-b from-slate-900 to-slate-950 p-8 hover:border-emerald-500/30 transition-all duration-500 flex-1 flex flex-col justify-between min-h-[260px]">
                <div>
                  <div className="bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 text-emerald-400 p-4 rounded-xl w-fit mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-emerald-500/10">
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-slate-200 mb-3 group-hover:text-emerald-400 transition-colors">Pharma-Grade Precision</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    DECIMAL(30,12) for quantities, BigInt for pricing. Internal storage in mg/µL ensures <span className="text-emerald-400 font-medium">0.001g accuracy</span>.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-800/50">
                  <span className="text-[10px] text-emerald-500/70 font-mono">Precision: ±0.001mg</span>
                </div>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="group relative flex flex-col h-full" style={{ animationDelay: '100ms' }}>
              <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500/20 to-cyan-600/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500" />
              <div className="relative rounded-2xl border border-slate-800 bg-gradient-to-b from-slate-900 to-slate-950 p-8 hover:border-cyan-500/30 transition-all duration-500 flex-1 flex flex-col justify-between min-h-[260px]">
                <div>
                  <div className="bg-gradient-to-br from-cyan-500/20 to-cyan-600/10 text-cyan-400 p-4 rounded-xl w-fit mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-cyan-500/10">
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-slate-200 mb-3 group-hover:text-cyan-400 transition-colors">B2B Quotation Workflow</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    Complete Buyer → Seller → Admin procurement flow with quotation negotiation, acceptance, and order conversion.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-800/50">
                  <span className="text-[10px] text-cyan-500/70 font-mono">Status: Multi-role</span>
                </div>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="group relative flex flex-col h-full" style={{ animationDelay: '200ms' }}>
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500/20 to-purple-600/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500" />
              <div className="relative rounded-2xl border border-slate-800 bg-gradient-to-b from-slate-900 to-slate-950 p-8 hover:border-purple-500/30 transition-all duration-500 flex-1 flex flex-col justify-between min-h-[260px]">
                <div>
                  <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/10 text-purple-400 p-4 rounded-xl w-fit mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-purple-500/10">
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-slate-200 mb-3 group-hover:text-purple-400 transition-colors">Complete Audit Trail</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    Every action logged with old/new values. Full compliance tracking for pharmaceutical regulatory requirements.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-800/50">
                  <span className="text-[10px] text-purple-500/70 font-mono">Compliant: GMP Ready</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Stats Section ────────────────────────────────────────────────── */}
      <section className="py-20 px-6 border-b border-slate-900/50 bg-slate-900/10">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: '30,12', label: 'Decimal Precision', icon: '⚡' },
              { value: '100%', label: 'Audit Coverage', icon: '🔒' },
              { value: '3', label: 'User Roles', icon: '👥' },
              { value: '24/7', label: 'Availability', icon: '🔄' },
            ].map((stat, index) => (
              <div key={index} className="text-center group flex flex-col items-center">
                <div className="text-3xl mb-3 text-emerald-400 group-hover:scale-110 transition-transform duration-300 inline-block">{stat.icon}</div>
                <div className="text-2xl font-bold text-slate-200 mb-1 font-mono tracking-tight">{stat.value}</div>
                <div className="text-xs text-slate-500 tracking-wide font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Enhanced Footer ──────────────────────────────────────────────── */}
      <footer className="border-t border-slate-900/80 bg-slate-950/70 backdrop-blur-md py-10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold">
                <span className="text-slate-200">Aasa</span>
                <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">MedChem</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 text-center md:text-left">
              © {new Date().getFullYear()} AasaMedChem. Precision Chemical & Pharmaceutical Procurement.
            </p>
            <div className="flex items-center gap-6 text-xs text-slate-500">
              <a href="#" className="hover:text-slate-300 transition-colors">Privacy Policy</a>
              <span className="text-slate-800">•</span>
              <a href="#" className="hover:text-slate-300 transition-colors">Terms of Service</a>
              <span className="text-slate-800">•</span>
              <a href="#" className="hover:text-slate-300 transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}