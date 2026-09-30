import { useState } from "react";
import { supabase } from "./supabaseClient";
import { LogOut } from "lucide-react";

export function AdminLogin({ onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (signInError) {
      setError(signInError.message);
      return;
    }

    setUser(data.user);
    onLoginSuccess(data.user);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setEmail("");
    setPassword("");
  };

  if (user) {
    return (
      <div className="rounded-lg bg-green-50 border border-green-200 p-4 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-green-900">Logged in as</p>
          <p className="text-green-700">{user.email}</p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
        >
          <LogOut className="h-4 w-4" /> Logout
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleLogin} className="rounded-lg border border-ink/10 bg-white p-6 max-w-sm">
      <h2 className="font-display text-xl font-semibold text-ink mb-4">Admin Login</h2>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="mb-4">
        <label className="block text-sm font-medium text-ink mb-1">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          className="w-full rounded-lg border border-ink/20 px-3 py-2 text-sm focus:outline-none focus:border-clay"
          required
        />
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-ink mb-1">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          className="w-full rounded-lg border border-ink/20 px-3 py-2 text-sm focus:outline-none focus:border-clay"
          required
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-clay px-4 py-2 text-sm font-semibold text-cream hover:bg-clay-dark disabled:opacity-50"
      >
        {loading ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}
