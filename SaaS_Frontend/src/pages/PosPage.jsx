import { useEffect, useState } from "react";
import { Minus, Plus, ShoppingBag, Trash2, CheckCircle } from "lucide-react";
import * as productsApi from "../api/products";
import * as salesApi from "../api/sales";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { ApiError } from "../api/client";

export function PosPage() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState("");
  const [customerName, setCustomerName] = useState("Walk-in Customer");
  const [discount, setDiscount] = useState("0");
  const [tax, setTax] = useState("0");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    productsApi
      .getProducts()
      .then((r) => setProducts(r.products.filter((p) => p.stock > 0)))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  function addToCart(product) {
    setCart((prev) => {
      const existing = prev.find((c) => c.product._id === product._id);
      if (existing) {
        if (existing.quantity >= product.stock) return prev;
        return prev.map((c) =>
          c.product._id === product._id
            ? { ...c, quantity: c.quantity + 1 }
            : c,
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    setSuccess(null);
  }

  function updateQty(productId, delta) {
    setCart((prev) =>
      prev
        .map((c) => {
          if (c.product._id !== productId) return c;
          const qty = c.quantity + delta;
          if (qty <= 0) return null;
          return { ...c, quantity: Math.min(qty, c.product.stock) };
        })
        .filter(Boolean),
    );
  }

  function removeFromCart(productId) {
    setCart((prev) => prev.filter((c) => c.product._id !== productId));
  }

  const subtotal = cart.reduce(
    (sum, c) => sum + c.product.price * c.quantity,
    0,
  );
  const discountNum = Number(discount) || 0;
  const taxNum = Number(tax) || 0;
  const total = subtotal - discountNum + taxNum;

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()),
  );

  async function checkout() {
    if (cart.length === 0) return;
    setCheckoutLoading(true);
    setError("");
    setSuccess(null);
    try {
      const res = await salesApi.createSale({
        items: cart.map((c) => ({
          product: c.product._id,
          quantity: c.quantity,
        })),
        customerName,
        discount: discountNum,
        tax: taxNum,
        paymentMethod,
      });
      setSuccess(res.sale.invoiceNumber);
      setCart([]);
      const refreshed = await productsApi.getProducts();
      setProducts(refreshed.products.filter((p) => p.stock > 0));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Checkout failed");
    } finally {
      setCheckoutLoading(false);
    }
  }

  return (
    <div>
      <header className="mb-8">
        <p className="text-sm font-medium text-brand-400">Checkout</p>
        <h1 className="text-3xl font-bold text-white">Point of Sale</h1>
      </header>

      {success && (
        <div className="mb-6 flex items-center gap-3 rounded-xl border border-brand-500/30 bg-brand-500/10 px-4 py-3 text-brand-300">
          <CheckCircle className="h-5 w-5 shrink-0" />
          Sale complete — Invoice{" "}
          <strong className="text-white">{success}</strong>
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-5">
        <div className="xl:col-span-3">
          <input
            type="search"
            placeholder="Search products to add..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mb-4 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-slate-100 placeholder:text-slate-500 outline-none focus:border-brand-500/50"
          />

          {loading ? (
            <div className="flex h-64 items-center justify-center glass rounded-2xl">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((p) => (
                <button
                  key={p._id}
                  type="button"
                  onClick={() => addToCart(p)}
                  className="glass rounded-xl p-4 text-left transition hover:border-brand-500/30 hover:bg-brand-500/5"
                >
                  <p className="font-semibold text-white">{p.name}</p>
                  <p className="mt-1 text-lg font-bold text-brand-400">
                    NRP.{p.price.toFixed(2)}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {p.stock} in stock
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="xl:col-span-2">
          <div className="glass sticky top-8 rounded-2xl p-6">
            <div className="mb-4 flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-brand-400" />
              <h2 className="font-semibold text-white">Cart ({cart.length})</h2>
            </div>

            {cart.length === 0 ? (
              <p className="py-12 text-center text-sm text-slate-500">
                Tap products to add them to the cart
              </p>
            ) : (
              <ul className="mb-6 max-h-64 space-y-3 overflow-y-auto">
                {cart.map((c) => (
                  <li
                    key={c.product._id}
                    className="flex items-center gap-3 rounded-xl bg-white/5 p-3"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-white">
                        {c.product.name}
                      </p>
                      <p className="text-xs text-slate-400">
                        NRP.{c.product.price.toFixed(2)} each
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => updateQty(c.product._id, -1)}
                        className="rounded-lg p-1 text-slate-400 hover:bg-white/10 hover:text-white"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-8 text-center text-sm font-medium text-white">
                        {c.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQty(c.product._id, 1)}
                        className="rounded-lg p-1 text-slate-400 hover:bg-white/10 hover:text-white"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    <span className="w-16 text-right text-sm font-semibold text-brand-400">
                      NRP.{(c.product.price * c.quantity).toFixed(2)}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeFromCart(c.product._id)}
                      className="text-slate-500 hover:text-red-400"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </li>
                ))}
              </ul>
            )}

            <div className="space-y-3 border-t border-white/10 pt-4">
              <Input
                label="Customer name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
              />
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Discount (Rs.)"
                  type="number"
                  min="0"
                  step="0.01"
                  value={discount}
                  onChange={(e) => setDiscount(e.target.value)}
                />
                <Input
                  label="Tax (Rs.)"
                  type="number"
                  min="0"
                  step="0.01"
                  value={tax}
                  onChange={(e) => setTax(e.target.value)}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-300">
                  Payment method
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-slate-100 outline-none focus:border-brand-500/50"
                >
                  <option value="cash">Cash</option>
                  <option value="card">Card</option>
                  <option value="online">Online</option>
                  <option value="credit">Credit</option>
                </select>
              </div>
            </div>

            <div className="mt-6 space-y-2 border-t border-white/10 pt-4 text-sm">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal</span>
                <span>NRP.{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-2xl font-bold text-white">
                <span>Total</span>
                <span className="text-brand-400">NRP.{total.toFixed(2)}</span>
              </div>
            </div>

            {error && <p className="mt-4 text-sm text-red-400">{error}</p>}

            <Button
              className="mt-6 w-full"
              size="lg"
              disabled={cart.length === 0}
              loading={checkoutLoading}
              onClick={checkout}
            >
              Complete sale
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
