'use client';

import Link from 'next/link';
import Button from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0f172a] text-slate-100 px-4">
      {/* Premium background chemistry glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.05)_0%,transparent_60%)] pointer-events-none" />
      
      <div className="relative max-w-md w-full text-center space-y-6 animate-slideUp">
        {/* Large 404 graphic with glowing border */}
        <div className="text-8xl font-black tracking-widest text-emerald-500/80 filter drop-shadow-[0_0_15px_rgba(16,185,129,0.3)]">
          404
        </div>
        
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-slate-100">Chemical Compound Missing</h1>
          <p className="text-sm text-slate-400 max-w-sm mx-auto">
            The page or resource you are looking for does not exist or has been relocated to another batch.
          </p>
        </div>

        <div className="pt-4">
          <Link href="/dashboard" passHref legacyBehavior>
            <a>
              <Button variant="primary" size="lg">
                Return to Dashboard
              </Button>
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
}
