import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";
import { AdminLogin } from "./AdminLogin";
import { AdminDashboard } from "./AdminDashboard";
import { ChevronLeft } from "lucide-react";

export function AdminPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user || null);
        setLoading(false);
      }
    );

    return () => authListener?.subscription.unsubscribe();
  }, []);

  const checkAuth = async () => {
    const { data } = await supabase.auth.getSession();
    setUser(data.session?.user || null);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-ink-soft">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-parchment/30">
      <div className="border-b border-ink/10 bg-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-6 flex items-center justify-between">
          <div>
            <a href="/" className="inline-flex items-center gap-2 text-clay hover:text-clay-dark mb-2">
              <ChevronLeft className="h-4 w-4" />
              Back to site
            </a>
            <h1 className="font-display text-2xl font-semibold text-ink">
              Admin Dashboard
            </h1>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8">
        {!user ? (
          <div className="max-w-md">
            <AdminLogin onLoginSuccess={(user) => setUser(user)} />
            <div className="mt-8 rounded-lg border border-ink/10 bg-white p-6">
              <h2 className="font-display text-lg font-semibold text-ink mb-3">
                First time setup?
              </h2>
              <ol className="space-y-3 text-sm text-ink-soft">
                <li>
                  <strong>1. Create a Supabase account</strong> at{" "}
                  <a
                    href="https://supabase.com"
                    target="_blank"
                    rel="noreferrer"
                    className="text-clay hover:underline"
                  >
                    supabase.com
                  </a>
                </li>
                <li>
                  <strong>2. Create a new project</strong> (free tier works great)
                </li>
                <li>
                  <strong>3. In your project settings:</strong>
                  <ul className="mt-2 ml-4 space-y-1 list-disc">
                    <li>
                      Copy your <code className="bg-ink/5 px-2 py-1 rounded">
                        SUPABASE_URL
                      </code>
                    </li>
                    <li>
                      Copy your <code className="bg-ink/5 px-2 py-1 rounded">
                        SUPABASE_ANON_KEY
                      </code>
                    </li>
                  </ul>
                </li>
                <li>
                  <strong>4. Create a .env.local file in your project root:</strong>
                  <pre className="mt-2 bg-ink/5 p-3 rounded text-xs overflow-x-auto">
{`VITE_SUPABASE_URL=your_url_here
VITE_SUPABASE_ANON_KEY=your_key_here`}
                  </pre>
                </li>
                <li>
                  <strong>5. In Supabase, create these tables:</strong>
                  <details className="mt-2 cursor-pointer">
                    <summary className="font-medium text-ink hover:text-clay">
                      Show SQL to run
                    </summary>
                    <pre className="mt-3 bg-ink/5 p-3 rounded text-xs overflow-x-auto">
{`-- Create site_content table
CREATE TABLE site_content (
  id INT PRIMARY KEY,
  hero_title TEXT,
  hero_subtitle TEXT,
  price INT,
  duration TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create galleries table
CREATE TABLE galleries (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  image_url TEXT NOT NULL,
  title TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Enable storage
-- Create 'gallery-images' bucket in Storage section
-- Set bucket to "Public"
-- Enable RLS on galleries and site_content tables
-- Add policy: anyone can read, authenticated users can insert/delete`}
                    </pre>
                  </details>
                </li>
                <li>
                  <strong>6. Refresh the page</strong> after setting up .env.local
                </li>
              </ol>
            </div>
          </div>
        ) : (
          <AdminDashboard />
        )}
      </div>
    </div>
  );
}
