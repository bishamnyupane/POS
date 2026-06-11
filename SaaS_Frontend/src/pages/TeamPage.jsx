import { useState } from 'react';
import { UserPlus, Users } from 'lucide-react';
import { createCashier } from '../api/admin';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { ApiError } from '../api/client';

export function TeamPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const res = await createCashier(form);
      setSuccess(`Cashier "${res.user.name}" created successfully.`);
      setForm({ name: '', email: '', password: '' });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to create cashier');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <header className="mb-8">
        <p className="text-sm font-medium text-brand-400">Admin</p>
        <h1 className="text-3xl font-bold text-white">Team</h1>
        <p className="mt-1 text-slate-400">
          Add cashiers who can process sales for your shop.
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-2">
        <Card>
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-500/15 text-brand-400">
              <UserPlus className="h-6 w-6" />
            </div>
            <div>
              <h2 className="font-semibold text-white">Add cashier</h2>
              <p className="text-sm text-slate-400">
                Cashiers can use POS and view products
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full name"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              required
            />
            <Input
              label="Email"
              type="email"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              required
            />
            <Input
              label="Password"
              type="password"
              value={form.password}
              onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
              minLength={6}
              required
            />
            {error && (
              <p className="rounded-lg bg-red-500/10 px-4 py-2 text-sm text-red-300">
                {error}
              </p>
            )}
            {success && (
              <p className="rounded-lg bg-brand-500/10 px-4 py-2 text-sm text-brand-300">
                {success}
              </p>
            )}
            <Button type="submit" loading={loading} className="w-full">
              Create cashier account
            </Button>
          </form>
        </Card>

        <Card className="flex flex-col items-center justify-center text-center">
          <Users className="mb-4 h-16 w-16 text-slate-600" />
          <h3 className="text-lg font-semibold text-white">Role permissions</h3>
          <ul className="mt-4 space-y-2 text-left text-sm text-slate-400">
            <li className="flex gap-2">
              <span className="text-brand-400">Admin</span> — Full access, manage team
            </li>
            <li className="flex gap-2">
              <span className="text-brand-400">Cashier</span> — POS, products, sales
            </li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
