import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Welcome to My App</h1>
      <div className="flex gap-4">
        <Link href="/login" className="px-4 py-2 bg-blue-600 text-white rounded">
          Login
        </Link>
        <Link href="/register" className="px-4 py-2 bg-green-600 text-white rounded">
          Register
        </Link>
      </div>
    </div>
  );
}
