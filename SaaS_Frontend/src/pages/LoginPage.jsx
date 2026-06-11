import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Store, Mail } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { ApiError } from '../api/client';

export function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="gradient-mesh flex min-h-screen items-center justify-center p-6">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-surface-800/50 shadow-2xl backdrop-blur-xl lg:grid-cols-2">
        <div className="hidden flex-col justify-between bg-gradient-to-br from-brand-600/30 to-surface-900 p-12 lg:flex">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-500 text-surface-900">
              <Store className="h-6 w-6" />
            </div>
            <span className="text-2xl font-bold text-white">ShopFlow</span>
          </div>
          <div>
            <h1 className="text-4xl font-bold leading-tight text-white">
              Run your shop
              <br />
              <span className="text-brand-400">smarter.</span>
            </h1>
            <p className="mt-4 text-slate-400">
              Inventory, point of sale, and sales analytics — all in one beautiful dashboard.
            </p>
          </div>
          <p className="text-sm text-slate-500">© ShopFlow Retail POS</p>
        </div>

        <div className="p-8 lg:p-12">
          <div className="mb-8 lg:hidden">
            <div className="flex items-center gap-2">
              <Store className="h-8 w-8 text-brand-400" />
              <span className="text-xl font-bold text-white">ShopFlow</span>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-white">Welcome back</h2>
          <p className="mt-1 text-slate-400">Sign in to your account</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@shop.com"
              required
            />
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
            {error && (
              <p className="rounded-lg bg-red-500/10 px-4 py-2 text-sm text-red-300">
                {error}
              </p>
            )}
            <Button type="submit" className="w-full" size="lg" loading={loading}>
              <Mail className="h-4 w-4" />
              Sign in
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-400">
            New here?{' '}
            <Link to="/register" className="font-semibold text-brand-400 hover:text-brand-300">
              Create your shop
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
