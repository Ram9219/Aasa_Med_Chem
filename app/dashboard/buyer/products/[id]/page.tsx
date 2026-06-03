// 'use client';

// import { useEffect, useState } from 'react';
// import { useParams } from 'next/navigation';
// import Link from 'next/link';
// import Card from '@/components/ui/card';
// import Badge from '@/components/ui/badge';
// import Button from '@/components/ui/button';
// import Input from '@/components/ui/input';
// import Select from '@/components/ui/select';
// import { PageLoader } from '@/components/ui/loading';
// import { formatQuantity, formatINR } from '@/lib/serialize';
// import Decimal from 'decimal.js';

// // eslint-disable-next-line @typescript-eslint/no-explicit-any
// type Product = Record<string, any>;

// export default function BuyerProductDetailPage() {
//   const params = useParams();
//   const [product, setProduct] = useState<Product | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [quantity, setQuantity] = useState('1');
//   const [unit, setUnit] = useState('kg');

//   useEffect(() => {
//     if (params.id) {
//       fetch(`/api/products/${params.id}`)
//         .then((r) => r.json())
//         .then((p) => {
//           setProduct(p);
//           setUnit(p.storageUnit === 'mg' ? 'kg' : p.storageUnit === 'ul' ? 'L' : 'unit');
//         })
//         .finally(() => setLoading(false));
//     }
//   }, [params.id]);

//   if (loading) return <PageLoader />;
//   if (!product) return <div className="text-center py-16 text-slate-500">Product not found</div>;

//   const unitOptions = product.storageUnit === 'mg'
//     ? [{ value: 'mg', label: 'mg' }, { value: 'g', label: 'g' }, { value: 'kg', label: 'kg' }]
//     : product.storageUnit === 'ul'
//       ? [{ value: 'ul', label: 'µL' }, { value: 'mL', label: 'mL' }, { value: 'L', label: 'L' }]
//       : [{ value: 'unit', label: 'unit' }];

//   // Live price calculation
//   let estimatedPrice = '—';
//   let convertedQty = '—';
//   try {
//     const qty = new Decimal(quantity || '0');
//     if (qty.gt(0)) {
//       const factors: Record<string, number> = { mg: 1, g: 1000, kg: 1000000, ul: 1, mL: 1000, L: 1000000, unit: 1 };
//       const storageQty = qty.times(factors[unit] || 1);
//       const totalPaise = storageQty.times(new Decimal(product.ratePerUnit));
//       estimatedPrice = formatINR(Number(totalPaise.toDecimalPlaces(0)));
//       convertedQty = `${storageQty.toFixed(2)} ${product.storageUnit}`;
//     }
//   } catch { /* invalid input */ }

//   return (
//     <div className="animate-slideUp max-w-4xl">
//       <div className="mb-6">
//         <Link href="/dashboard/buyer/products" className="text-xs text-slate-500 hover:text-slate-300 transition-colors">
//           ← Back to Browse
//         </Link>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         {/* Main Info */}
//         <div className="lg:col-span-2 space-y-6">
//           <Card>
//             <div className="flex items-start justify-between mb-4">
//               <div>
//                 <Badge variant="info">{product.category}</Badge>
//                 <h1 className="text-2xl font-bold text-slate-100 mt-2">{product.name}</h1>
//                 {product.chemicalName && <p className="text-sm text-slate-400 mt-1">{product.chemicalName}</p>}
//               </div>
//               {product.purity && (
//                 <span className="text-lg font-bold text-emerald-400">{product.purity}%</span>
//               )}
//             </div>
//             {product.description && <p className="text-sm text-slate-400 mb-4">{product.description}</p>}

//             <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
//               <div><span className="text-slate-500 text-xs">CAS Number</span><p className="text-slate-200 font-mono">{product.casNumber || '—'}</p></div>
//               <div><span className="text-slate-500 text-xs">Molecular Formula</span><p className="text-slate-200 font-mono">{product.molecularFormula || '—'}</p></div>
//               <div><span className="text-slate-500 text-xs">Molecular Weight</span><p className="text-slate-200">{product.molecularWeight || '—'}</p></div>
//               <div><span className="text-slate-500 text-xs">Grade</span><p className="text-slate-200">{product.grade || '—'}</p></div>
//               <div><span className="text-slate-500 text-xs">Manufacturer</span><p className="text-slate-200">{product.manufacturer || '—'}</p></div>
//               <div><span className="text-slate-500 text-xs">Batch Number</span><p className="text-slate-200 font-mono">{product.batchNumber || '—'}</p></div>
//               <div><span className="text-slate-500 text-xs">Expiry Date</span><p className="text-slate-200">{product.expiryDate ? new Date(product.expiryDate).toLocaleDateString('en-IN') : '—'}</p></div>
//               <div><span className="text-slate-500 text-xs">Storage</span><p className="text-slate-200">{product.storageConditions || '—'}</p></div>
//               <div><span className="text-slate-500 text-xs">Hazard Class</span><p className="text-slate-200">{product.hazardClass || '—'}</p></div>
//             </div>
//           </Card>

//           <Card>
//             <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-3">Availability</h3>
//             <div className="grid grid-cols-2 gap-4 text-sm">
//               <div><span className="text-slate-500 text-xs">Available Stock</span><p className="text-lg font-bold text-emerald-400">{formatQuantity(product.stockQuantity, product.storageUnit)}</p></div>
//               <div><span className="text-slate-500 text-xs">Seller</span><p className="text-slate-200">{product.seller?.companyName || '—'}</p></div>
//             </div>
//           </Card>
//         </div>

//         {/* Price Calculator */}
//         <div className="space-y-6">
//           <Card className="border-emerald-500/20">
//             <h3 className="text-sm font-semibold text-emerald-400 uppercase tracking-wider mb-4">💰 Price Calculator</h3>

//             <div className="space-y-3 mb-4">
//               <Input label="Quantity" type="number" step="0.001" value={quantity} onChange={(e) => setQuantity(e.target.value)} min="0" />
//               <Select label="Unit" options={unitOptions} value={unit} onChange={(e) => setUnit(e.target.value)} />
//             </div>

//             <div className="p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20 space-y-2">
//               <div className="flex justify-between text-xs"><span className="text-slate-500">Converted</span><span className="text-slate-300 font-mono">{convertedQty}</span></div>
//               <div className="flex justify-between text-sm"><span className="text-slate-400">Estimated Price</span><span className="text-emerald-400 font-bold text-lg">{estimatedPrice}</span></div>
//               <p className="text-[10px] text-slate-600">+ 18% GST. Final price may vary based on seller quotation.</p>
//             </div>

//             <Link href={`/dashboard/buyer/quotations/new?productId=${product.id}`} className="block mt-4">
//               <Button className="w-full" size="lg">Request Quotation</Button>
//             </Link>
//           </Card>
//         </div>
//       </div>
//     </div>
//   );
// }


'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Card from '@/components/ui/card';
import Badge from '@/components/ui/badge';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import Select from '@/components/ui/select';
import { PageLoader } from '@/components/ui/loading';
import { formatQuantity, formatINR } from '@/lib/serialize';
import Decimal from 'decimal.js';
import { 
  ArrowLeft, 
  FlaskConical, 
  Package, 
  Building2, 
  Calendar, 
  Thermometer, 
  AlertTriangle,
  Calculator,
  TrendingUp,
  CheckCircle,
  FileText
} from 'lucide-react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Product = Record<string, any>;

export default function BuyerProductDetailPage() {
  const params = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState('1');
  const [unit, setUnit] = useState('kg');

  useEffect(() => {
    if (params.id) {
      fetch(`/api/products/${params.id}`)
        .then((r) => r.json())
        .then((p) => {
          setProduct(p);
          setUnit(p.storageUnit === 'mg' ? 'kg' : p.storageUnit === 'ul' ? 'L' : 'unit');
        })
        .finally(() => setLoading(false));
    }
  }, [params.id]);

  if (loading) return <PageLoader />;
  if (!product) return (
    <div className="max-w-7xl mx-auto px-4 py-16 text-center">
      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-950/50 flex items-center justify-center">
        <FlaskConical className="w-8 h-8 text-red-600 dark:text-red-400" />
      </div>
      <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-1">Product not found</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">The product you're looking for doesn't exist or has been removed</p>
      <Link href="/dashboard/buyer/products">
        <Button variant="primary">Browse Products</Button>
      </Link>
    </div>
  );

  const unitOptions = product.storageUnit === 'mg'
    ? [{ value: 'mg', label: 'Milligrams (mg)' }, { value: 'g', label: 'Grams (g)' }, { value: 'kg', label: 'Kilograms (kg)' }]
    : product.storageUnit === 'ul'
      ? [{ value: 'ul', label: 'Microliters (µL)' }, { value: 'mL', label: 'Milliliters (mL)' }, { value: 'L', label: 'Liters (L)' }]
      : [{ value: 'unit', label: 'Units' }];

  // Live price calculation
  let estimatedPrice = '—';
  let convertedQty = '—';
  try {
    const qty = new Decimal(quantity || '0');
    if (qty.gt(0)) {
      const factors: Record<string, number> = { mg: 1, g: 1000, kg: 1000000, ul: 1, mL: 1000, L: 1000000, unit: 1 };
      const storageQty = qty.times(factors[unit] || 1);
      const totalPaise = storageQty.times(new Decimal(product.ratePerUnit));
      estimatedPrice = formatINR(Number(totalPaise.toDecimalPlaces(0)));
      convertedQty = `${storageQty.toFixed(2)} ${product.storageUnit}`;
    }
  } catch { /* invalid input */ }

  const infoSections = [
    { label: 'CAS Number', value: product.casNumber, icon: FileText, mono: true },
    { label: 'Molecular Formula', value: product.molecularFormula, icon: FlaskConical, mono: true },
    { label: 'Molecular Weight', value: product.molecularWeight, icon: TrendingUp },
    { label: 'Grade', value: product.grade, icon: CheckCircle },
    { label: 'Manufacturer', value: product.manufacturer, icon: Building2 },
    { label: 'Batch Number', value: product.batchNumber, icon: Package, mono: true },
    { label: 'Expiry Date', value: product.expiryDate ? new Date(product.expiryDate).toLocaleDateString('en-IN') : null, icon: Calendar },
    { label: 'Storage', value: product.storageConditions, icon: Thermometer },
    { label: 'Hazard Class', value: product.hazardClass, icon: AlertTriangle },
  ].filter(section => section.value);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Navigation */}
      <div className="mb-6">
        <Link 
          href="/dashboard/buyer/products" 
          className="inline-flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Back to Browse
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Info Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Product Header Card */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="info" size="sm">
                      {product.category}
                    </Badge>
                    {product.purity && (
                      <Badge variant="approved" size="sm">
                        {product.purity}% Purity
                      </Badge>
                    )}
                  </div>
                  <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 tracking-tight">
                    {product.name}
                  </h1>
                  {product.chemicalName && (
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                      {product.chemicalName}
                    </p>
                  )}
                </div>
              </div>
              
              {product.description && (
                <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {product.description}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Technical Details Card */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                Technical Specifications
              </h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {infoSections.map((section) => (
                  <div key={section.label} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                      <section.icon className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wide">
                        {section.label}
                      </p>
                      <p className={`text-sm font-medium text-slate-900 dark:text-slate-100 mt-0.5 ${section.mono ? 'font-mono' : ''}`}>
                        {section.value || '—'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Availability Card */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                Availability
              </h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wide">
                    Available Stock
                  </p>
                  <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                    {formatQuantity(product.stockQuantity, product.storageUnit)}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wide">
                    Seller
                  </p>
                  <p className="text-base font-semibold text-slate-900 dark:text-slate-100 mt-1">
                    {product.seller?.companyName || '—'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Price Calculator Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-6 space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-emerald-200 dark:border-emerald-800/50 shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 px-6 py-4 border-b border-emerald-200 dark:border-emerald-800/50">
                <div className="flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  <h3 className="text-sm font-semibold text-emerald-900 dark:text-emerald-100 uppercase tracking-wide">
                    Price Calculator
                  </h3>
                </div>
              </div>
              
              <div className="p-6 space-y-5">
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wide">
                    Quantity
                  </label>
                  <Input 
                    type="number" 
                    step="0.001" 
                    value={quantity} 
                    onChange={(e) => setQuantity(e.target.value)} 
                    min="0"
                    className="text-lg"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wide">
                    Unit
                  </label>
                  <Select 
                    options={unitOptions} 
                    value={unit} 
                    onChange={(e) => setUnit(e.target.value)} 
                  />
                </div>

                <div className="pt-2">
                  <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-500 dark:text-slate-400">Converted Quantity</span>
                      <span className="text-slate-700 dark:text-slate-300 font-mono font-medium">
                        {convertedQty}
                      </span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-slate-200 dark:border-slate-700">
                      <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                        Estimated Price
                      </span>
                      <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                        {estimatedPrice}
                      </span>
                    </div>
                    <div className="pt-2">
                      <p className="text-[11px] text-slate-500 dark:text-slate-500 leading-relaxed">
                        * Excluding 18% GST. Final price may vary based on seller quotation.
                      </p>
                    </div>
                  </div>
                </div>

                <Link href={`/dashboard/buyer/quotations/new?productId=${product.id}`}>
                  <Button className="w-full" size="lg">
                    Request Quotation
                  </Button>
                </Link>
              </div>
            </div>

            {/* Quick Info Card */}
            <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800/30 p-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
                  <Package className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-100">Need Help?</h4>
                  <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                    Contact our sales team for bulk orders or special requirements
                  </p>
                  <button className="text-xs font-medium text-blue-600 dark:text-blue-400 mt-2 hover:underline">
                    Contact Support →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}