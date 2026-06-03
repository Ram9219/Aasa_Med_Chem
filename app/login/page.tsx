// 'use client';

// import { useState } from 'react';
// import { signIn } from 'next-auth/react';
// import { useRouter } from 'next/navigation';
// import { useToast } from '@/components/ui/toast';
// import Button from '@/components/ui/button';
// import Input from '@/components/ui/input';
// import Link from 'next/link';

// export default function LoginPage() {
//   const router = useRouter();
//   const { addToast } = useToast();
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setError('');

//     try {
//       const result = await signIn('credentials', {
//         email,
//         password,
//         redirect: false,
//       });

//       if (result?.error) {
//         setError('Invalid email or password');
//         addToast('error', 'Login failed. Please check your credentials.');
//       } else {
//         addToast('success', 'Login successful! Redirecting...');
//         // Redirect to dashboard — proxy.ts will handle role-based redirect
//         router.push('/dashboard');
//         router.refresh();
//       }
//     } catch {
//       setError('An unexpected error occurred');
//       addToast('error', 'Something went wrong. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const quickLogin = async (loginEmail: string, loginPassword: string) => {
//     setEmail(loginEmail);
//     setPassword(loginPassword);
//     setLoading(true);
//     setError('');

//     try {
//       const result = await signIn('credentials', {
//         email: loginEmail,
//         password: loginPassword,
//         redirect: false,
//       });

//       if (result?.error) {
//         setError('Invalid credentials');
//         addToast('error', 'Quick login failed.');
//       } else {
//         addToast('success', 'Login successful!');
//         router.push('/dashboard');
//         router.refresh();
//       }
//     } catch {
//       setError('An unexpected error occurred');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen px-4 relative overflow-hidden">
//       {/* Background effects */}
//       <div
//         className="absolute inset-0 opacity-20"
//         style={{
//           background:
//             'radial-gradient(ellipse at 30% 30%, rgba(16, 185, 129, 0.12) 0%, transparent 50%), radial-gradient(ellipse at 70% 70%, rgba(6, 182, 212, 0.08) 0%, transparent 50%)',
//         }}
//       />

//       <div className="relative z-10 w-full max-w-md">
//         {/* Logo */}
//         <div className="text-center mb-8 animate-slideUp">
//           <Link href="/" className="inline-block">
//             <h1 className="text-3xl font-bold">
//               <span className="text-slate-100">Aasa</span>
//               <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
//                 MedChem
//               </span>
//             </h1>
//           </Link>
//           <p className="text-sm text-slate-500 mt-2">Sign in to your account</p>
//         </div>

//         {/* Login Card */}
//         <div
//           className="glass-strong rounded-2xl p-8 shadow-2xl animate-slideUp"
//           style={{ animationDelay: '100ms' }}
//         >
//           <form onSubmit={handleSubmit} className="space-y-5">
//             <Input
//               label="Email"
//               type="email"
//               placeholder="you@company.com"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//               prefix={
//                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
//                 </svg>
//               }
//             />

//             <Input
//               label="Password"
//               type="password"
//               placeholder="••••••••"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//               error={error}
//               prefix={
//                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
//                 </svg>
//               }
//             />

//             <Button
//               type="submit"
//               loading={loading}
//               className="w-full"
//               size="lg"
//             >
//               Sign In
//             </Button>
//           </form>
//         </div>

//         {/* Quick Login Buttons */}
//         <div
//           className="mt-6 animate-slideUp"
//           style={{ animationDelay: '200ms' }}
//         >
//           <p className="text-xs text-slate-600 text-center mb-3 uppercase tracking-wider font-semibold">
//             Quick Demo Login
//           </p>
//           <div className="grid grid-cols-3 gap-3">
//             <button
//               onClick={() => quickLogin('admin@aasamedchem.com', 'Admin@123')}
//               disabled={loading}
//               className="flex flex-col items-center gap-1.5 px-3 py-3 rounded-xl border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 hover:border-red-500/30 transition-all text-xs font-medium text-red-300 disabled:opacity-50 cursor-pointer"
//             >
//               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
//               </svg>
//               Admin
//             </button>
//             <button
//               onClick={() => quickLogin('seller@chemco.com', 'Seller@123')}
//               disabled={loading}
//               className="flex flex-col items-center gap-1.5 px-3 py-3 rounded-xl border border-purple-500/20 bg-purple-500/5 hover:bg-purple-500/10 hover:border-purple-500/30 transition-all text-xs font-medium text-purple-300 disabled:opacity-50 cursor-pointer"
//             >
//               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
//               </svg>
//               Seller
//             </button>
//             <button
//               onClick={() => quickLogin('buyer@pharma.com', 'Buyer@123')}
//               disabled={loading}
//               className="flex flex-col items-center gap-1.5 px-3 py-3 rounded-xl border border-cyan-500/20 bg-cyan-500/5 hover:bg-cyan-500/10 hover:border-cyan-500/30 transition-all text-xs font-medium text-cyan-300 disabled:opacity-50 cursor-pointer"
//             >
//               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
//               </svg>
//               Buyer
//             </button>
//           </div>
//         </div>

//         <div className="text-center mt-6 animate-slideUp" style={{ animationDelay: '300ms' }}>
//           <Link href="/" className="text-xs text-slate-600 hover:text-slate-400 transition-colors">
//             ← Back to Home
//           </Link>
//         </div>

//         <div className="text-center mt-3 animate-slideUp" style={{ animationDelay: '350ms' }}>
//           <p className="text-xs text-slate-500">
//             New buyer account?{' '}
//             <Link href="/register" className="text-emerald-400 hover:text-emerald-300 transition-colors font-medium">
//               Create one here
//             </Link>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }

'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/toast';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const { addToast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid email or password');
        addToast('error', 'Login failed. Please check your credentials.');
      } else {
        addToast('success', 'Login successful! Redirecting...');
        router.push('/dashboard');
        router.refresh();
      }
    } catch {
      setError('An unexpected error occurred');
      addToast('error', 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const quickLogin = async (loginEmail: string, loginPassword: string) => {
    setEmail(loginEmail);
    setPassword(loginPassword);
    setLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        email: loginEmail,
        password: loginPassword,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid credentials');
        addToast('error', 'Quick login failed.');
      } else {
        addToast('success', 'Login successful!');
        router.push('/dashboard');
        router.refresh();
      }
    } catch {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Animated background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl animate-pulse animation-delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        
        {/* Animated grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.05)_1px,transparent_1px)] bg-[size:40px_40px]" />
        
        {/* Floating particles */}
        <div className="absolute top-20 left-10 w-1 h-1 bg-emerald-400 rounded-full animate-float" />
        <div className="absolute top-40 right-20 w-2 h-2 bg-cyan-400 rounded-full animate-float animation-delay-500" />
        <div className="absolute bottom-32 left-1/4 w-1.5 h-1.5 bg-purple-400 rounded-full animate-float animation-delay-1000" />
        <div className="absolute top-1/2 right-1/3 w-1 h-1 bg-emerald-400 rounded-full animate-float animation-delay-1500" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo with enhanced animation */}
        <div className="text-center mb-8 animate-fadeInUp">
          <Link href="/" className="inline-block group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-cyan-400 blur-2xl opacity-20 group-hover:opacity-40 transition-opacity" />
              <h1 className="text-4xl font-bold relative">
                <span className="text-white">Aasa</span>
                <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                  MedChem
                </span>
              </h1>
            </div>
          </Link>
          <p className="text-sm text-slate-400 mt-2">Welcome back! Please sign in to continue</p>
        </div>

        {/* Login Card with glass morphism */}
        <div
          className="relative backdrop-blur-xl bg-white/5 rounded-2xl p-8 shadow-2xl border border-white/10 animate-fadeInUp animation-delay-100 hover:shadow-emerald-500/5 transition-shadow duration-500"
        >
          {/* Card gradient border effect */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-cyan-500/10 to-purple-500/10 opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
          
          <form onSubmit={handleSubmit} className="space-y-5 relative">
            <div className="transform transition-all duration-300 hover:translate-x-1">
              <Input
                label="Email Address"
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-emerald-500/50 focus:ring-emerald-500/20"
                prefix={
                  <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                }
              />
            </div>

            <div className="transform transition-all duration-300 hover:translate-x-1">
              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                error={error}
                className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-emerald-500/50 focus:ring-emerald-500/20"
                prefix={
                  <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                }
              />
            </div>

            <Button
              type="submit"
              loading={loading}
              className="w-full relative overflow-hidden group bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 transition-all duration-300 transform hover:scale-[1.02]"
              size="lg"
            >
              <span className="relative z-10">Sign In</span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            </Button>
          </form>
        </div>

        {/* Quick Login Buttons with enhanced design */}
        <div
          className="mt-8 animate-fadeInUp animation-delay-200"
        >
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-3 bg-transparent text-slate-400">Quick Demo Login</span>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-3 mt-6">
            <button
              onClick={() => quickLogin('admin@aasamedchem.com', 'Admin@123')}
              disabled={loading}
              className="group relative overflow-hidden flex flex-col items-center gap-1.5 px-3 py-3 rounded-xl bg-gradient-to-br from-red-500/10 to-red-600/5 border border-red-500/20 hover:border-red-500/40 transition-all duration-300 hover:scale-105 disabled:opacity-50 cursor-pointer"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/0 via-red-500/10 to-red-500/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              <svg className="w-5 h-5 text-red-400 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span className="text-xs font-semibold text-red-300 group-hover:text-red-200 transition-colors">Admin</span>
              <span className="text-[10px] text-red-400/60">Full Access</span>
            </button>
            
            <button
              onClick={() => quickLogin('seller@chemco.com', 'Seller@123')}
              disabled={loading}
              className="group relative overflow-hidden flex flex-col items-center gap-1.5 px-3 py-3 rounded-xl bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 hover:scale-105 disabled:opacity-50 cursor-pointer"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-purple-500/10 to-purple-500/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              <svg className="w-5 h-5 text-purple-400 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <span className="text-xs font-semibold text-purple-300 group-hover:text-purple-200 transition-colors">Seller</span>
              <span className="text-[10px] text-purple-400/60">Sell Products</span>
            </button>
            
            <button
              onClick={() => quickLogin('buyer@pharma.com', 'Buyer@123')}
              disabled={loading}
              className="group relative overflow-hidden flex flex-col items-center gap-1.5 px-3 py-3 rounded-xl bg-gradient-to-br from-cyan-500/10 to-cyan-600/5 border border-cyan-500/20 hover:border-cyan-500/40 transition-all duration-300 hover:scale-105 disabled:opacity-50 cursor-pointer"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/10 to-cyan-500/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              <svg className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
              </svg>
              <span className="text-xs font-semibold text-cyan-300 group-hover:text-cyan-200 transition-colors">Buyer</span>
              <span className="text-[10px] text-cyan-400/60">Purchase Items</span>
            </button>
          </div>
        </div>

        {/* Navigation links */}
        <div className="mt-8 space-y-3 animate-fadeInUp animation-delay-300">
          <Link 
            href="/" 
            className="group flex items-center justify-center gap-2 text-sm text-slate-400 hover:text-slate-300 transition-colors"
          >
            <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </Link>
          
          <div className="text-center">
            <p className="text-sm text-slate-400">
              New buyer account?{' '}
              <Link 
                href="/register" 
                className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent font-semibold hover:from-emerald-300 hover:to-cyan-300 transition-all duration-300"
              >
                Create one here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}