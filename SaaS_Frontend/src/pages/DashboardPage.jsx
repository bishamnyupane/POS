import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Package, TrendingUp, AlertTriangle, ArrowRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { StatCard } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import * as productsApi from "../api/products";
import * as salesApi from "../api/sales";

export function DashboardPage() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([productsApi.getProducts(), salesApi.getSales()])
      .then(([p, s]) => {
        setProducts(p.products);
        setSales(s.sales);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const revenue = sales.reduce((sum, s) => sum + s.totalAmount, 0);
  const lowStock = products.filter((p) => p.stock <= 5);
  const todaySales = sales.filter((s) => {
    const d = new Date(s.createdAt || "");
    const now = new Date();
    return d.toDateString() === now.toDateString();
  });

  return (
    <div>
      <header className="mb-8">
        <p className="text-sm font-medium text-brand-400">Overview</p>
        <h1 className="text-3xl font-bold text-white">
          Hello, {user?.name?.split(" ")[0]} 👋
        </h1>
        <p className="mt-1 text-slate-400">
          Here&apos;s what&apos;s happening at {user?.shopName} today.
        </p>
      </header>

      {loading ? (
        <div className="flex h-48 items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
        </div>
      ) : (
        <>
          <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              label="Total products"
              value={products.length}
              icon={<Package className="h-6 w-6" />}
            />
            <StatCard
              label="Total revenue"
              value={`NRP.${revenue.toFixed(2)}`}
              icon={
                <span className="text-brand-400 text-lg font-semibold">NRP</span>
              }
              trend={`${sales.length} transactions`}
            />
            <StatCard
              label="Sales today"
              value={todaySales.length}
              icon={<TrendingUp className="h-6 w-6" />}
            />
            <StatCard
              label="Low stock items"
              value={lowStock.length}
              icon={<AlertTriangle className="h-6 w-6" />}
              trend={lowStock.length > 0 ? "Needs attention" : "All good"}
            />
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="glass rounded-2xl p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-semibold text-white">Recent sales</h2>
                <Link to="/sales">
                  <Button variant="ghost" size="sm">
                    View all <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
              {sales.length === 0 ? (
                <p className="py-8 text-center text-sm text-slate-500">
                  No sales yet. Open the POS to make your first sale.
                </p>
              ) : (
                <ul className="space-y-3">
                  {sales.slice(0, 5).map((sale) => (
                    <li
                      key={sale._id}
                      className="flex items-center justify-between rounded-xl bg-white/5 px-4 py-3"
                    >
                      <div>
                        <p className="text-sm font-medium text-white">
                          {sale.invoiceNumber}
                        </p>
                        <p className="text-xs text-slate-400">
                          {sale.customerName} · {sale.items.length} items
                        </p>
                      </div>
                      <span className="font-semibold text-brand-400">
                        NRP.{sale.totalAmount.toFixed(2)}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="glass rounded-2xl p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-semibold text-white">Low stock alert</h2>
                <Link to="/products">
                  <Button variant="ghost" size="sm">
                    Manage <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
              {lowStock.length === 0 ? (
                <p className="py-8 text-center text-sm text-slate-500">
                  All products are well stocked.
                </p>
              ) : (
                <ul className="space-y-3">
                  {lowStock.slice(0, 5).map((p) => (
                    <li
                      key={p._id}
                      className="flex items-center justify-between rounded-xl bg-amber-500/10 px-4 py-3"
                    >
                      <span className="text-sm font-medium text-white">
                        {p.name}
                      </span>
                      <span className="text-sm text-amber-300">
                        {p.stock} left
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link to="/pos">
              <Button size="lg">Open Point of Sale</Button>
            </Link>
            <Link to="/products">
              <Button variant="secondary" size="lg">
                Add products
              </Button>
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
