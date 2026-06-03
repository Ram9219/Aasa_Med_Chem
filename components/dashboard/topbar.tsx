// 'use client';

// import { signOut } from 'next-auth/react';
// import type { Session } from 'next-auth';
// import Badge from '@/components/ui/badge';

// export default function Topbar({ session }: { session: Session }) {
//   const role = session.user.role?.toUpperCase();
//   const roleBadge = role === 'ADMIN' ? 'admin' : role === 'SELLER' ? 'seller' : 'buyer';

//   return (
//     <header className="flex items-center justify-between px-6 lg:px-8 py-3 border-b border-[var(--border-default)] bg-[var(--bg-secondary)]">
//       {/* Left: Page context */}
//       <div className="flex items-center gap-3">
//         {/* Mobile menu button placeholder */}
//         <button className="lg:hidden text-slate-400 hover:text-slate-200 cursor-pointer">
//           <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
//           </svg>
//         </button>
//         <div>
//           <h2 className="text-sm font-semibold text-slate-200">
//             {session.user.companyName || 'AasaMedChem'}
//           </h2>
//           <p className="text-xs text-slate-500">
//             {session.user.name}
//           </p>
//         </div>
//       </div>

//       {/* Right: User info + actions */}
//       <div className="flex items-center gap-4">
//         <Badge variant={roleBadge as 'admin' | 'seller' | 'buyer'} dot>
//           {role}
//         </Badge>

//         {/* User avatar */}
//         <div className="flex items-center gap-3 pl-4 border-l border-[var(--border-default)]">
//           <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500/30 to-cyan-500/30 flex items-center justify-center border border-emerald-500/20">
//             <span className="text-xs font-semibold text-emerald-300">
//               {session.user.name?.charAt(0)?.toUpperCase() || 'U'}
//             </span>
//           </div>
//           <button
//             onClick={() => signOut({ callbackUrl: '/login' })}
//             className="text-xs text-slate-500 hover:text-red-400 transition-colors font-medium cursor-pointer"
//           >
//             Logout
//           </button>
//         </div>
//       </div>
//     </header>
//   );
// }



'use client';

import { useState } from 'react';
import { signOut } from 'next-auth/react';
import type { Session } from 'next-auth';
import Badge from '@/components/ui/badge';

export default function Topbar({ 
  session,
  onMenuToggle 
}: { 
  session: Session;
  onMenuToggle?: () => void;
}) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const role = session.user.role?.toUpperCase();
  const roleBadge = role === 'ADMIN' ? 'admin' : role === 'SELLER' ? 'seller' : 'buyer';
  const userInitial = session.user.name?.charAt(0)?.toUpperCase() || 'U';

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await signOut({ callbackUrl: '/login' });
  };

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between px-6 lg:px-8 py-3 border-b border-white/10 bg-[rgba(10,15,30,0.76)] backdrop-blur-xl">
      {/* Left: Page context */}
      <div className="flex items-center gap-4">
        {/* Mobile menu button */}
        <button 
          onClick={onMenuToggle}
          className="lg:hidden group relative p-2 text-slate-400 hover:text-slate-200 transition-colors rounded-xl hover:bg-white/5 cursor-pointer border border-transparent hover:border-white/10"
          aria-label="Toggle navigation menu"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold text-slate-100 truncate">
              {session.user.companyName || 'AasaMedChem'}
            </h2>
            {/* Online indicator */}
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
          </div>
          <p className="text-xs text-slate-500 truncate">
            {session.user.name}
          </p>
        </div>
      </div>

      {/* Right: User info + actions */}
      <div className="flex items-center gap-4">
        {/* Role Badge - Hidden on very small screens */}
        <div className="hidden sm:block">
          <Badge variant={roleBadge as 'admin' | 'seller' | 'buyer'} dot>
            {role}
          </Badge>
        </div>

        {/* Quick actions */}
        <div className="hidden md:flex items-center gap-2">
          {/* Notifications button (placeholder) */}
          <button className="p-2 text-slate-400 hover:text-slate-200 transition-colors rounded-xl hover:bg-white/5 cursor-pointer relative border border-transparent hover:border-white/10">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* Settings button (placeholder) */}
          <button className="p-2 text-slate-400 hover:text-slate-200 transition-colors rounded-xl hover:bg-white/5 cursor-pointer border border-transparent hover:border-white/10">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>

        {/* Divider */}
        <div className="h-6 w-px bg-white/10 hidden sm:block" />

        {/* User section */}
        <div className="flex items-center gap-3">
          {/* User avatar with dropdown trigger */}
          <div className="group relative">
            <button className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500/30 to-cyan-500/30 flex items-center justify-center border-2 border-emerald-500/20 hover:border-emerald-500/40 transition-all duration-300 hover:scale-105 cursor-pointer shadow-[0_8px_24px_rgba(16,185,129,0.12)]">
              <span className="text-xs font-semibold text-emerald-200">
                {userInitial}
              </span>
            </button>
            
            {/* Tooltip on hover */}
            <div className="absolute right-0 top-full mt-2 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <div className="bg-slate-900/95 border border-white/10 rounded-2xl shadow-2xl shadow-black/30 p-2 backdrop-blur-xl">
                <div className="px-3 py-2 border-b border-white/10">
                  <p className="text-sm font-medium text-slate-100">{session.user.name}</p>
                  <p className="text-xs text-slate-400">{session.user.email}</p>
                </div>
                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="w-full text-left px-3 py-2 text-xs text-slate-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isLoggingOut ? (
                    <>
                      <svg className="animate-spin w-3 h-3" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Logging out...
                    </>
                  ) : (
                    <>
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                      </svg>
                      Sign Out
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}