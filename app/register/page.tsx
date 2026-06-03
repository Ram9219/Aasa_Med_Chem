'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import { useToast } from '@/components/ui/toast';

type AccountRole = 'BUYER' | 'SELLER';

export default function RegisterPage() {
  const router = useRouter();
  const { addToast } = useToast();
  const [fullName, setFullName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<AccountRole>('BUYER');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          companyName,
          email,
          phone,
          password,
          role,
        }),
      });

      const payload = await response.json();

      if (!response.ok) {
        const message = typeof payload.error === 'string' ? payload.error : 'Registration failed';
        setError(message);
        addToast('error', message);
        return;
      }

      addToast('success', 'Account created. Signing you in...');

      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        router.push('/login');
        return;
      }

      router.push('/dashboard');
      router.refresh();
    } catch {
      const message = 'Something went wrong. Please try again.';
      setError(message);
      addToast('error', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10">
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background:
            'radial-gradient(circle at 15% 15%, rgba(16, 185, 129, 0.22) 0%, transparent 26%), radial-gradient(circle at 85% 10%, rgba(6, 182, 212, 0.18) 0%, transparent 22%), radial-gradient(circle at 50% 85%, rgba(59, 130, 246, 0.12) 0%, transparent 30%), linear-gradient(180deg, rgba(6,10,18,0.98) 0%, rgba(8,15,25,0.92) 100%)',
        }}
      />

      <div className="absolute left-[-8rem] top-24 h-64 w-64 rounded-full bg-emerald-500/15 blur-3xl" />
      <div className="absolute right-[-6rem] bottom-20 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />

      <div className="relative z-10 w-full max-w-6xl grid gap-8 lg:grid-cols-[1.06fr_0.94fr]">
        <div className="hidden lg:flex flex-col justify-between rounded-[2.25rem] border border-white/10 bg-[linear-gradient(180deg,rgba(14,20,34,0.92),rgba(7,11,18,0.94))] p-10 shadow-2xl shadow-black/35 backdrop-blur-xl">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-emerald-300/80">Account setup</p>
            <h1 className="mt-4 max-w-xl text-5xl font-semibold leading-tight text-white">
              A sharper way to join the marketplace.
            </h1>
            <p className="mt-5 max-w-xl text-sm leading-6 text-slate-400">
              Choose the account type first, then complete the form. Buyers can source, compare, and order.
              Sellers can list products and respond to demand.
            </p>
          </div>

          <div className="grid gap-4">
            <div className="rounded-[1.5rem] border border-emerald-500/20 bg-emerald-500/6 p-5 shadow-lg shadow-emerald-950/10">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-400/20">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
                  </svg>
                </div>
                <div>
                  <div className="text-sm font-semibold text-emerald-200">Buyer account</div>
                  <div className="mt-1 text-sm text-slate-400">Browse catalog, request quotes, and place orders.</div>
                </div>
              </div>
            </div>
            <div className="rounded-[1.5rem] border border-cyan-500/20 bg-cyan-500/6 p-5 shadow-lg shadow-cyan-950/10">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-500/15 text-cyan-300 ring-1 ring-cyan-400/20">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div>
                  <div className="text-sm font-semibold text-cyan-200">Seller account</div>
                  <div className="mt-1 text-sm text-slate-400">List products, manage inventory, and respond to buyer requests.</div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 text-xs text-slate-400">
              <div className="rounded-[1.25rem] border border-white/10 bg-black/20 p-4">
                <div className="text-slate-200 font-semibold">Fast signup</div>
                <div className="mt-1">Short, focused form.</div>
              </div>
              <div className="rounded-[1.25rem] border border-white/10 bg-black/20 p-4">
                <div className="text-slate-200 font-semibold">Role-based</div>
                <div className="mt-1">Buyer or seller.</div>
              </div>
              <div className="rounded-[1.25rem] border border-white/10 bg-black/20 p-4">
                <div className="text-slate-200 font-semibold">Secure auth</div>
                <div className="mt-1">NextAuth credentials.</div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full max-w-2xl lg:justify-self-end">
          <div className="mb-6 text-center lg:hidden">
            <Link href="/" className="inline-block text-3xl font-bold text-white">
              Aasa<span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">MedChem</span>
            </Link>
            <p className="mt-2 text-sm text-slate-500">Choose buyer or seller to continue</p>
          </div>

          <div className="rounded-[1.9rem] border border-white/10 bg-[rgba(8,15,25,0.9)] p-8 shadow-2xl shadow-black/35 backdrop-blur-xl sm:p-10">
            <div className="mb-8">
              <p className="text-xs uppercase tracking-[0.3em] text-emerald-300/70">Register</p>
              <h2 className="mt-3 text-3xl font-semibold text-white">Create your account</h2>
              <p className="mt-2 text-sm text-slate-500">
                Pick the account type first, then complete the form.
              </p>
            </div>

            <div className="mb-6 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setRole('BUYER')}
                aria-pressed={role === 'BUYER'}
                className={`group rounded-[1.35rem] border p-5 text-left transition-all duration-200 ${
                  role === 'BUYER'
                    ? 'border-emerald-400/55 bg-emerald-500/12 shadow-lg shadow-emerald-950/25 translate-y-[-1px]'
                    : 'border-white/10 bg-white/5 hover:border-emerald-400/30 hover:bg-white/[0.07]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className={`text-sm font-semibold ${role === 'BUYER' ? 'text-emerald-200' : 'text-slate-200'}`}>
                      Buyer account
                    </div>
                    <p className="mt-1 text-sm text-slate-500">
                      Source products and request quotations.
                    </p>
                  </div>
                  <div className={`h-11 w-11 rounded-2xl border flex items-center justify-center ${role === 'BUYER' ? 'border-emerald-400/30 bg-emerald-400/10' : 'border-white/10 bg-white/5'}`}>
                    <svg className={`h-5 w-5 ${role === 'BUYER' ? 'text-emerald-300' : 'text-slate-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
                    </svg>
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setRole('SELLER')}
                aria-pressed={role === 'SELLER'}
                className={`group rounded-[1.35rem] border p-5 text-left transition-all duration-200 ${
                  role === 'SELLER'
                    ? 'border-cyan-400/55 bg-cyan-500/12 shadow-lg shadow-cyan-950/25 translate-y-[-1px]'
                    : 'border-white/10 bg-white/5 hover:border-cyan-400/30 hover:bg-white/[0.07]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className={`text-sm font-semibold ${role === 'SELLER' ? 'text-cyan-200' : 'text-slate-200'}`}>
                      Seller account
                    </div>
                    <p className="mt-1 text-sm text-slate-500">
                      List products and respond to buyers.
                    </p>
                  </div>
                  <div className={`h-11 w-11 rounded-2xl border flex items-center justify-center ${role === 'SELLER' ? 'border-cyan-400/30 bg-cyan-400/10' : 'border-white/10 bg-white/5'}`}>
                    <svg className={`h-5 w-5 ${role === 'SELLER' ? 'text-cyan-300' : 'text-slate-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                </div>
              </button>
            </div>

            <div className="mb-5 flex items-center justify-between rounded-[1.2rem] border border-white/10 bg-black/20 px-4 py-3 text-sm text-slate-300">
              <div>
                <span className="font-semibold text-slate-100">{role === 'BUYER' ? 'Buyer' : 'Seller'}</span>{' '}
                account selected.
              </div>
              <div className={`rounded-full px-3 py-1 text-[11px] font-medium ${role === 'BUYER' ? 'bg-emerald-500/10 text-emerald-200' : 'bg-cyan-500/10 text-cyan-200'}`}>
                {role === 'BUYER' ? 'Best for procurement teams' : 'Best for suppliers'}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                label="Full Name"
                type="text"
                placeholder="Priya Sharma"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />

              <Input
                label="Company Name"
                type="text"
                placeholder="PharmaCorp Ltd"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                required
              />

              <Input
                label="Email"
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <Input
                label="Phone"
                type="tel"
                placeholder="+91-9876543210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />

              <input type="hidden" value={role} readOnly />

              <Input
                label="Password"
                type="password"
                placeholder="Minimum 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                error={error}
              />

              <Input
                label="Confirm Password"
                type="password"
                placeholder="Re-enter password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                error={error && password !== confirmPassword ? error : ''}
              />

              <Button type="submit" loading={loading} className="w-full" size="lg">
                Create Account
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-slate-500">
              Already have an account?{' '}
              <Link href="/login" className="font-medium text-emerald-400 hover:text-emerald-300 transition-colors">
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}