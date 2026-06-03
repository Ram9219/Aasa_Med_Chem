// 'use client';

// import { useEffect, useState } from 'react';
// import Link from 'next/link';
// import Card from '@/components/ui/card';
// import Badge from '@/components/ui/badge';
// import Input from '@/components/ui/input';
// import Select from '@/components/ui/select';
// import { CardSkeleton } from '@/components/ui/loading';
// import { formatQuantity } from '@/lib/serialize';

// // eslint-disable-next-line @typescript-eslint/no-explicit-any
// type ProductRow = Record<string, any>;

// const CATEGORIES = [
//   { value: '', label: 'All Categories' },
//   { value: 'Solvents', label: 'Solvents' },
//   { value: 'API', label: 'API' },
//   { value: 'Excipients', label: 'Excipients' },
//   { value: 'Reagents', label: 'Reagents' },
//   { value: 'Lab Supplies', label: 'Lab Supplies' },
// ];

// export default function BuyerProductsPage() {
//   const [products, setProducts] = useState<ProductRow[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [search, setSearch] = useState('');
//   const [category, setCategory] = useState('');

//   useEffect(() => {
//     const params = new URLSearchParams();
//     if (search) params.set('search', search);
//     if (category) params.set('category', category);
//     const url = `/api/products${params.toString() ? '?' + params : ''}`;

//     setLoading(true);
//     fetch(url).then((r) => r.json()).then(setProducts).finally(() => setLoading(false));
//   }, [search, category]);

//   return (
//     <div className="animate-slideUp">
//       <div className="mb-6">
//         <h1 className="text-2xl font-bold text-slate-100">Browse Chemicals</h1>
//         <p className="text-sm text-slate-500 mt-1">Search and request quotations for chemicals</p>
//       </div>

//       {/* Filters */}
//       <div className="flex gap-4 mb-6">
//         <div className="flex-1 max-w-sm">
//           <Input placeholder="Search by name, CAS #, SKU..." value={search} onChange={(e) => setSearch(e.target.value)} prefix={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>} />
//         </div>
//         <div className="w-48">
//           <Select options={CATEGORIES} value={category} onChange={(e) => setCategory(e.target.value)} />
//         </div>
//       </div>

//       {/* Product Grid */}
//       {loading ? (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
//           <CardSkeleton /><CardSkeleton /><CardSkeleton /><CardSkeleton /><CardSkeleton /><CardSkeleton />
//         </div>
//       ) : products.length === 0 ? (
//         <div className="text-center py-16">
//           <svg className="w-12 h-12 mx-auto text-slate-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
//           <p className="text-sm text-slate-500">No chemicals found matching your search</p>
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 stagger-children">
//           {products.map((p) => (
//             <Card key={p.id} hover padding="sm" className="animate-slideUp">
//               <div className="flex items-start justify-between mb-3">
//                 <Badge variant="info">{p.category}</Badge>
//                 {p.purity && <span className="text-xs text-emerald-400 font-semibold">{p.purity}% pure</span>}
//               </div>
//               <h3 className="text-base font-semibold text-slate-100 mb-1">{p.name}</h3>
//               <p className="text-xs text-slate-500 mb-3">{p.casNumber ? `CAS: ${p.casNumber}` : p.chemicalName || p.description || 'No description'}</p>

//               <div className="grid grid-cols-2 gap-2 text-xs mb-4">
//                 <div>
//                   <span className="text-slate-500">Stock</span>
//                   <p className="text-slate-300 font-medium">{formatQuantity(p.stockQuantity, p.storageUnit)}</p>
//                 </div>
//                 <div>
//                   <span className="text-slate-500">Grade</span>
//                   <p className="text-slate-300 font-medium">{p.grade || '—'}</p>
//                 </div>
//                 <div>
//                   <span className="text-slate-500">Seller</span>
//                   <p className="text-slate-300 font-medium">{p.seller?.companyName || '—'}</p>
//                 </div>
//                 <div>
//                   <span className="text-slate-500">SKU</span>
//                   <p className="text-slate-300 font-medium font-mono text-[11px]">{p.sku}</p>
//                 </div>
//               </div>

//               <div className="flex gap-2">
//                 <Link href={`/dashboard/buyer/products/${p.id}`} className="flex-1">
//                   <button className="w-full text-xs font-medium py-2 rounded-lg border border-[var(--border-light)] text-slate-300 hover:bg-white/5 transition-colors cursor-pointer">
//                     View Details
//                   </button>
//                 </Link>
//                 <Link href={`/dashboard/buyer/quotations/new?productId=${p.id}`}>
//                   <button className="text-xs font-semibold py-2 px-3 rounded-lg bg-emerald-600 text-white hover:bg-emerald-500 transition-colors cursor-pointer">
//                     Request Quote
//                   </button>
//                 </Link>
//               </div>
//             </Card>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }


'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Card from '@/components/ui/card';
import Badge from '@/components/ui/badge';
import Input from '@/components/ui/input';
import Select from '@/components/ui/select';
import { CardSkeleton } from '@/components/ui/loading';
import { formatQuantity } from '@/lib/serialize';
import { Search, Filter, Package, TrendingUp, Clock, ChevronRight, Beaker, FlaskConical } from 'lucide-react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ProductRow = Record<string, any>;

const CATEGORIES = [
  { value: '', label: 'All Categories' },
  { value: 'Solvents', label: 'Solvents' },
  { value: 'API', label: 'API' },
  { value: 'Excipients', label: 'Excipients' },
  { value: 'Reagents', label: 'Reagents' },
  { value: 'Lab Supplies', label: 'Lab Supplies' },
];

export default function BuyerProductsPage() {
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (category) params.set('category', category);
    const url = `/api/products${params.toString() ? '?' + params : ''}`;

    setLoading(true);
    fetch(url).then((r) => r.json()).then(setProducts).finally(() => setLoading(false));
  }, [search, category]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 tracking-tight">
              Browse Chemicals
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Discover high-quality chemicals and request quotations
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <TrendingUp className="w-4 h-4" />
            <span>{products.length} products available</span>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
              <input
                type="text"
                placeholder="Search by name, CAS number, or SKU..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 dark:focus:border-emerald-500 transition-all"
              />
            </div>
          </div>
          <div className="sm:w-56">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 dark:focus:border-emerald-500 appearance-none cursor-pointer transition-all"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="h-5 w-16 bg-slate-200 dark:bg-slate-700 rounded"></div>
                  <div className="h-5 w-12 bg-slate-200 dark:bg-slate-700 rounded"></div>
                </div>
                <div className="h-5 w-3/4 bg-slate-200 dark:bg-slate-700 rounded mb-2"></div>
                <div className="h-4 w-full bg-slate-200 dark:bg-slate-700 rounded mb-4"></div>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded"></div>
                  <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded"></div>
                </div>
                <div className="flex gap-2">
                  <div className="flex-1 h-8 bg-slate-200 dark:bg-slate-700 rounded"></div>
                  <div className="w-24 h-8 bg-slate-200 dark:bg-slate-700 rounded"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
            <Beaker className="w-8 h-8 text-slate-400 dark:text-slate-600" />
          </div>
          <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-1">
            No products found
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Try adjusting your search or filter criteria
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((p) => (
            <div
              key={p.id}
              className="group bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-emerald-200 dark:hover:border-emerald-800 transition-all duration-200 overflow-hidden"
            >
              <div className="p-5">
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <Badge variant="info" size="sm">
                    {p.category}
                  </Badge>
                  {p.purity && (
                    <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                      {p.purity}% purity
                    </span>
                  )}
                </div>

                {/* Title */}
                <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-1 line-clamp-1">
                  {p.name}
                </h3>
                
                {/* Description */}
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 line-clamp-2">
                  {p.casNumber ? `CAS: ${p.casNumber}` : p.chemicalName || p.description || 'No description available'}
                </p>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-y-2 gap-x-3 mb-4">
                  <div>
                    <p className="text-[11px] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wide">
                      Stock
                    </p>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {formatQuantity(p.stockQuantity, p.storageUnit)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wide">
                      Grade
                    </p>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {p.grade || '—'}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wide">
                      Seller
                    </p>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate">
                      {p.seller?.companyName || '—'}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wide">
                      SKU
                    </p>
                    <p className="text-xs font-mono text-slate-600 dark:text-slate-400">
                      {p.sku}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <Link href={`/dashboard/buyer/products/${p.id}`} className="flex-1">
                    <button className="w-full text-xs font-medium py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer">
                      View Details
                    </button>
                  </Link>
                  <Link href={`/dashboard/buyer/quotations/new?productId=${p.id}`}>
                    <button className="text-xs font-semibold py-2 px-4 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors cursor-pointer shadow-sm hover:shadow-md">
                      Request Quote
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}