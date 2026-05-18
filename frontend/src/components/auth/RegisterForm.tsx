'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authApi } from '@/lib/api';
import { useAuthStore } from '@/stores/authStore';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

export default function RegisterForm() {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { setAuth } = useAuthStore();
  const router = useRouter();

  const set = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await authApi.register(form);
      setAuth(data.user, data.token);
      router.push('/feed');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error;
      setError(msg || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input
        label="Username"
        placeholder="coolcurator"
        value={form.username}
        onChange={set('username')}
        required
        minLength={3}
        maxLength={50}
      />
      <Input
        label="Email"
        type="email"
        placeholder="you@example.com"
        value={form.email}
        onChange={set('email')}
        required
        autoComplete="email"
      />
      <Input
        label="Password"
        type="password"
        placeholder="Min. 8 characters"
        value={form.password}
        onChange={set('password')}
        required
        minLength={8}
        autoComplete="new-password"
      />
      {error && (
        <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
          {error}
        </div>
      )}
      <Button type="submit" loading={loading} size="lg" className="mt-2 w-full">
        Create Account
      </Button>
      <p className="text-center text-sm text-text-muted">
        Already have an account?{' '}
        <Link href="/login" className="text-accent hover:text-accent-light transition-colors">
          Sign in
        </Link>
      </p>
    </form>
  );
}