'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (res.ok) {
        alert(data.message || 'Registration successful!');
        router.push('/login');
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (err) {
      setError('Server error');
    }
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      flexDirection: 'column',
    }}>
      <form
        onSubmit={handleSubmit}
        style={{ display: 'flex', flexDirection: 'column', gap: 12, width: 300, padding: 20, border: '1px solid #ccc', borderRadius: 8 }}
      >
        <h2 style={{ textAlign: 'center' }}>Register</h2>
        {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required style={{ padding: '0.5rem' }} />
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required style={{ padding: '0.5rem' }} />
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required style={{ padding: '0.5rem' }} />
        <button type="submit" style={{ padding: '0.5rem' }}>Click Here</button>
      </form>
      <p style={{ marginTop: 10 }}>
        Already have an account?{' '}
        <span
          onClick={() => router.push('/login')}
          style={{ color: 'blue', cursor: 'pointer', textDecoration: 'underline' }}
        >
          Login
        </span>
      </p>
    </div>
  );
}
