// import type { Metadata } from 'next';
// import { Inter } from 'next/font/google';
// import Providers from './providers';
// import './globals.css';

// const inter = Inter({
//   subsets: ['latin'],
//   variable: '--font-inter',
//   display: 'swap',
// });

// export const metadata: Metadata = {
//   title: 'AasaMedChem — B2B Chemical & Pharmaceutical Procurement',
//   description:
//     'Precision-first B2B procurement platform for chemicals and pharmaceuticals. Manage quotations, orders, and inventory with pharma-grade accuracy.',
//   keywords: ['chemicals', 'pharmaceuticals', 'B2B', 'procurement', 'inventory', 'quotation'],
// };

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
//     <html lang="en" className={`${inter.variable} h-full antialiased`}>
//       <body className="min-h-full flex flex-col">
//         <Providers>{children}</Providers>
//       </body>
//     </html>
//   );
// }



import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Providers from './providers';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'], // Add specific weights for better font loading
});

export const metadata: Metadata = {
  title: {
    default: 'AasaMedChem — B2B Chemical & Pharmaceutical Procurement',
    template: '%s | AasaMedChem', // For dynamic page titles
  },
  description:
    'Precision-first B2B procurement platform for chemicals and pharmaceuticals. Manage quotations, orders, and inventory with pharma-grade accuracy.',
  keywords: [
    'chemicals', 
    'pharmaceuticals', 
    'B2B', 
    'procurement', 
    'inventory', 
    'quotation',
    'supply chain',
    'laboratory',
    'research chemicals',
  ],
  authors: [{ name: 'AasaMedChem' }],
  creator: 'AasaMedChem',
  publisher: 'AasaMedChem',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  openGraph: {
    title: 'AasaMedChem — B2B Chemical & Pharmaceutical Procurement',
    description:
      'Precision-first B2B procurement platform for chemicals and pharmaceuticals. Manage quotations, orders, and inventory with pharma-grade accuracy.',
    type: 'website',
    locale: 'en_US',
    siteName: 'AasaMedChem',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AasaMedChem — B2B Chemical & Pharmaceutical Procurement',
    description:
      'Precision-first B2B procurement platform for chemicals and pharmaceuticals.',
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html 
      lang="en" 
      className={`${inter.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        {/* Preload critical assets if needed */}
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
          crossOrigin="anonymous"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body className="min-h-full flex flex-col bg-gray-950 text-slate-200">
        {/* Optional: Skip to main content for accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-emerald-600 focus:text-white focus:rounded-lg"
        >
          Skip to main content
        </a>
        
        <main id="main-content" className="flex-1 flex flex-col">
          <Providers>{children}</Providers>
        </main>
      </body>
    </html>
  );
}