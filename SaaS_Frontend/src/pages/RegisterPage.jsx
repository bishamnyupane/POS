import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Store, UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { ApiError } from '../api/client';

export function RegisterPage() {
  const { register } = useAuth();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    shopName: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(form);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="gradient-mesh flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-md glass rounded-3xl p-8 shadow-2xl">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-500 text-surface-900">
            <Store className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Start your shop</h2>
            <p className="text-sm text-slate-400">Register as admin</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Your name"
            value={form.name}
            onChange={(e) => update('name', e.target.value)}
            placeholder="Jane Doe"
            required
          />
          <Input
            label="Shop name"
            value={form.shopName}
            onChange={(e) => update('shopName', e.target.value)}
            placeholder="Jane's Boutique"
            required
          />
          <Input
            label="Email"
            type="email"
            value={form.email}
            onChange={(e) => update('email', e.target.value)}
            placeholder="you@shop.com"
            required
          />
          <Input
            label="Password"
            type="password"
            value={form.password}
            onChange={(e) => update('password', e.target.value)}
            placeholder="Min. 6 characters"
            minLength={6}
            required
          />
          {error && (
            <p className="rounded-lg bg-red-500/10 px-4 py-2 text-sm text-red-300">
              {error}
            </p>
          )}
          <Button type="submit" className="w-full" size="lg" loading={loading}>
            <UserPlus className="h-4 w-4" />
            Create account
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-400">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-brand-400 hover:text-brand-300">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
