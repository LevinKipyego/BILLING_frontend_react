import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BaseUrl } from "../../BaseUrl";

export default function PortalLogin() {
  const navigate = useNavigate();

  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  // Keep the login page background uniform with the client's current system theme preference
  useEffect(() => {
    const cachedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (cachedTheme === "dark" || (!cachedTheme && prefersDark)) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const res = await axios.post(`${BaseUrl}/api/portal/login/`, {
        username,
        password,
      });

      localStorage.setItem("portal_access", res.data.portal_access);
      localStorage.setItem("portal_refresh", res.data.refresh);

      navigate("/portal");
    } catch (err: any) {
      setError(err?.response?.data?.error || "Login execution failed. Check connections.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 text-zinc-800 dark:text-zinc-100 px-4 font-['Figtree',sans-serif] transition-colors duration-200">
      <div className="bg-white dark:bg-zinc-900 w-full max-w-md rounded-2xl shadow-sm border border-zinc-200/80 dark:border-zinc-800/80 p-6 sm:p-8">
        
        {/* BRAND TITLE PLACEMENT */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-500 mb-3">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100">KayoNet Client Portal</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1.5 text-sm font-medium">
            Login using your PPPoE network credentials
          </p>
        </div>

        {/* INPUT SUBMISSION BLOCK */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-zinc-600 dark:text-zinc-400 mb-2">
              Username / Phone
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. 254712345678"
              className="w-full bg-transparent border border-zinc-300 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 dark:focus:border-emerald-500 text-zinc-800 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600 transition"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-zinc-600 dark:text-zinc-400 mb-2">
              Account Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-transparent border border-zinc-300 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 dark:focus:border-emerald-500 text-zinc-800 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600 transition"
              required
            />
          </div>

          {/* CUSTOM DJANGO MATCHED ERROR BANNER */}
          {error && (
            <div className="bg-red-50 dark:bg-red-950/20 text-red-800 dark:text-red-400 border-l-4 border-red-500 text-sm rounded-xl p-4 transition-all">
              <div className="flex gap-2">
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-medium">{error}</span>
              </div>
            </div>
          )}

          {/* ACTION SUBMIT BLOCK */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl shadow-md shadow-emerald-600/10 dark:shadow-none transition duration-150 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.99]"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Verifying Authentications...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

      </div>
    </div>
  );
}