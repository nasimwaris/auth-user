"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "./utils/api";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [page, setPage] = useState<"login" | "register" | "dashboard">("login");
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  // Login/Register state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const t = localStorage.getItem("token");
    if (t) {
      setToken(t);
      setPage("dashboard");
      api.get("/auth/me", { headers: { Authorization: `Bearer ${t}` } })
        .then(res => setUser(res.data))
        .catch(() => {
          localStorage.removeItem("token");
          setToken(null);
          setPage("login");
        });
    }
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await api.post("/auth/register", { name, email, password });
      alert("Registration successful! Please login.");
      setPage("login");
      setName(""); setEmail(""); setPassword("");
    } catch (err: any) {
      setError(err.response?.data?.message || "Server error");
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const res = await api.post("/auth/login", { email, password });
      if (res.data.access_token) {
        localStorage.setItem("token", res.data.access_token);
        setToken(res.data.access_token);
        setPage("dashboard");
        const userRes = await api.get("/auth/me", {
          headers: { Authorization: `Bearer ${res.data.access_token}` }
        });
        setUser(userRes.data);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Server error");
    }
  };

  return (
    <html lang="en">
      <body className="bg-gray-100">
        {page === "register" && (
          <div className="min-h-screen flex items-center justify-center">
            <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
              <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
              {error && <p className="text-red-500 mb-4">{error}</p>}
              <form onSubmit={handleRegister} className="space-y-4">
                <input
                  type="text"
                  placeholder="Name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                  className="w-full border px-3 py-2 rounded"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className="w-full border px-3 py-2 rounded"
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  className="w-full border px-3 py-2 rounded"
                />
                <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">
                  Register
                </button>
              </form>
              <p className="mt-4 text-center">
                Already have account?{" "}
                <button onClick={() => setPage("login")} className="text-blue-600 underline">
                  Login
                </button>
              </p>
            </div>
          </div>
        )}

        {page === "login" && (
          <div className="min-h-screen flex items-center justify-center">
            <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
              <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
              {error && <p className="text-red-500 mb-4">{error}</p>}
              <form onSubmit={handleLogin} className="space-y-4">
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className="w-full border px-3 py-2 rounded"
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  className="w-full border px-3 py-2 rounded"
                />
                <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">
                  Login
                </button>
              </form>
              <p className="mt-4 text-center">
                Don't have account?{" "}
                <button onClick={() => setPage("register")} className="text-blue-600 underline">
                  Register
                </button>
              </p>
            </div>
          </div>
        )}

        {page === "dashboard" && (
          <div className="p-8">
            <h1 className="text-2xl font-bold">Dashboard</h1>
            {user ? <p>Welcome, {user.name}</p> : <p>Loading...</p>}
            <button
              className="mt-4 bg-red-600 text-white px-4 py-2 rounded"
              onClick={() => {
                localStorage.removeItem("token");
                setToken(null);
                setPage("login");
              }}
            >
              Logout
            </button>
          </div>
        )}
      </body>
    </html>
  );
}
