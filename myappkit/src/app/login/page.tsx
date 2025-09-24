'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppKit } from '@reown/appkit/react';

export default function LoginPage() {
  const router = useRouter();
  const { open } = useAppKit();

  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Input handler
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Normal Email/Password login
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (res.ok && data.access_token) {
        localStorage.setItem('token', data.access_token);
        router.replace('/dashboard'); // redirect after login
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Server error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Wallet login
  const handleWalletLogin = async () => {
    setError('');
    setIsSubmitting(true);

    try {
      const walletData = await open(); // returns { hash }

      if (!walletData?.hash) {
        setError('Wallet login failed');
        return;
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/wallet-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hash: walletData.hash }), // must match backend
      });

      const data = await res.json();

      if (res.ok && data.access_token) {
        localStorage.setItem('token', data.access_token);
        router.replace('/dashboard'); // ✅ redirect
      } else {
        setError(data.message || 'Wallet login failed');
      }
    } catch (err) {
      console.error('Wallet login error:', err);
      setError('Something went wrong with wallet login');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '5rem', gap: '2rem' }}>
      <form
        onSubmit={handleSubmit}
        style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 320, padding: 20, border: '1px solid #ccc', borderRadius: 8 }}
      >
        <h2 style={{ textAlign: 'center' }}>Login</h2>
        {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required style={{ padding: '0.5rem' }} />
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required style={{ padding: '0.5rem' }} />
        <button type="submit" disabled={isSubmitting} style={{ padding: '0.5rem' }}>
          {isSubmitting ? 'Logging in...' : 'Login'}
        </button>
      </form>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
        <appkit-button onClick={handleWalletLogin} disabled={isSubmitting}>
          {isSubmitting ? 'Connecting Wallet...' : 'Connect Wallet'}
        </appkit-button>
        <p>
          New user?{' '}
          <span onClick={() => router.push('/register')} style={{ color: 'blue', cursor: 'pointer', textDecoration: 'underline' }}>
            Register
          </span>
        </p>
      </div>
    </div>
  );
}
