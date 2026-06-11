import { useEffect, useState } from 'react';
import { Receipt, ChevronDown, ChevronUp } from 'lucide-react';
import * as salesApi from '../api/sales';
import { Badge } from '../components/ui/Badge';

export function SalesPage() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    salesApi
      .getSales()
      .then((r) => setSales(r.sales))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <header className="mb-8">
        <p className="text-sm font-medium text-brand-400">History</p>
        <h1 className="text-3xl font-bold text-white">Sales</h1>
        <p className="mt-1 text-slate-400">{sales.length} transactions</p>
      </header>

      <div className="glass overflow-hidden rounded-2xl">
        {loading ? (
          <div className="flex h-48 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
          </div>
        ) : sales.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-slate-500">
            <Receipt className="mb-4 h-12 w-12 opacity-50" />
            <p>No sales recorded yet.</p>
          </div>
        ) : (
          <ul className="divide-y divide-white/10">
            {sales.map((sale) => {
              const isOpen = expanded === sale._id;
              const createdBy =
                typeof sale.createdBy === 'object'
                  ? sale.createdBy.name
                  : 'Staff';

              return (
                <li key={sale._id}>
                  <button
                    type="button"
                    onClick={() =>
                      setExpanded(isOpen ? null : sale._id)
                    }
                    className="flex w-full items-center gap-4 px-6 py-4 text-left transition hover:bg-white/5"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-500/15 text-brand-400">
                      <Receipt className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-white">
                        {sale.invoiceNumber}
                      </p>
                      <p className="text-sm text-slate-400">
                        {sale.customerName} · {sale.items.length} items ·{' '}
                        {createdBy}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-brand-400">
                        NRP.{sale.totalAmount.toFixed(2)}
                      </p>
                      <Badge variant="success">{sale.paymentMethod}</Badge>
                    </div>
                    {isOpen ? (
                      <ChevronUp className="h-5 w-5 text-slate-500" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-slate-500" />
                    )}
                  </button>

                  {isOpen && (
                    <div className="border-t border-white/5 bg-white/[0.02] px-6 py-4">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="text-slate-500">
                            <th className="pb-2 text-left font-medium">Item</th>
                            <th className="pb-2 text-right font-medium">Qty</th>
                            <th className="pb-2 text-right font-medium">Price</th>
                            <th className="pb-2 text-right font-medium">Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {sale.items.map((item, i) => (
                            <tr key={i} className="text-slate-300">
                              <td className="py-1">
                                {item.productName ||
                                  (typeof item.product === 'object' 
                                    ? item.product.name
                                    : 'Product')}
                              </td>
                              <td className="py-1 text-right">{item.quantity}</td>
                              <td className="py-1 text-right">
                                NRP.{item.price.toFixed(2)}
                              </td>
                              <td className="py-1 text-right text-brand-400">
                                NRP.{item.total.toFixed(2)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      <div className="mt-4 flex justify-end gap-6 text-sm text-slate-400">
                        <span>Subtotal: NRP.{sale.subtotal.toFixed(2)}</span>
                        {sale.discount > 0 && (
                          <span>Discount: -NRP.{sale.discount.toFixed(2)}</span>
                        )}
                        {sale.tax > 0 && <span>Tax: NRP.{sale.tax.toFixed(2)}</span>}
                      </div>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
