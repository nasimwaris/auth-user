'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.replace('/login'); // Redirect if no token
        return;
      }

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          // Token invalid or expired
          localStorage.removeItem('token');
          router.replace('/login');
          return;
        }

        const data: User = await res.json();
        setUser(data);
      } catch (err) {
        console.error('Failed to fetch user:', err);
        localStorage.removeItem('token');
        router.replace('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.replace('/login');
  };

  if (loading) return <p>Loading...</p>;
  if (!user) return null;

  return (
    <div style={{ maxWidth: 400, margin: '2rem auto', padding: '1rem', border: '1px solid #ccc', borderRadius: 8, textAlign: 'center' }}>
      <h2>Welcome, {user.name}</h2>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Role:</strong> {user.role}</p>
      <p><strong>User ID:</strong> {user.id}</p>

      <button
        onClick={handleLogout}
        style={{ marginTop: '1rem', padding: '0.5rem 1rem', backgroundColor: '#f00', color: '#fff', border: 'none', borderRadius: 4 }}
      >
        Logout
      </button>
    </div>
  );
}
