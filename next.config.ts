import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['next-auth'],
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
