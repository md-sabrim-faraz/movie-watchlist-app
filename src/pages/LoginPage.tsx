import { Film, Home, Loader2, Lock, Mail } from "lucide-react";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

interface LoginLocationState {
  from?: string;
  action?: "add-to-watchlist" | "view-watchlist";
  movieId?: string;
}

export function LoginPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LoginLocationState | null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { error: authError } = isSignUp
        ? await signUp(email, password)
        : await signIn(email, password);

      if (authError) {
        setError(authError.message);
      } else {
        // Redirect to return URL if present, otherwise go to search
        const returnUrl = state?.from || "/search";
        navigate(returnUrl);
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Generate context message based on action
  const getContextMessage = () => {
    if (!state?.action) return null;

    switch (state.action) {
      case "add-to-watchlist":
        return "Log in to add this movie to your watchlist";
      case "view-watchlist":
        return "Log in to view your watchlist";
      default:
        return null;
    }
  };

  const contextMessage = getContextMessage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 pt-24 pb-12 px-4 flex items-center justify-center">
      <div className="w-full max-w-md">
        <Link
          to="/search"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-emerald-400 transition-colors duration-300 mb-8"
        >
          <Home className="h-5 w-5" />
          <span>Back to Search</span>
        </Link>

        <div className="text-center mb-8 animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Film className="h-12 w-12 text-emerald-400" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              MovieWatch
            </h1>
          </div>
          {contextMessage ? (
            <p className="text-emerald-400 text-lg font-medium mb-2">
              {contextMessage}
            </p>
          ) : null}
          <p className="text-slate-400 text-lg">
            {isSignUp
              ? "Create an account to start tracking"
              : "Welcome back! Sign in to continue"}
          </p>
        </div>

        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-500" />

          <div className="relative bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-slate-700 shadow-2xl p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-slate-900/50 text-white placeholder-slate-500 pl-12 pr-4 py-3.5 rounded-xl border border-slate-600 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all duration-300"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="w-full bg-slate-900/50 text-white placeholder-slate-500 pl-12 pr-4 py-3.5 rounded-xl border border-slate-600 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all duration-300"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-400 text-sm animate-fade-in">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-semibold py-4 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>
                      {isSignUp ? "Creating Account..." : "Signing In..."}
                    </span>
                  </>
                ) : (
                  <span>{isSignUp ? "Sign Up" : "Sign In"}</span>
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setError("");
                }}
                className="text-slate-400 hover:text-emerald-400 transition-colors duration-300"
              >
                {isSignUp ? (
                  <>
                    Already have an account?{" "}
                    <span className="font-semibold">Sign In</span>
                  </>
                ) : (
                  <>
                    Don't have an account?{" "}
                    <span className="font-semibold">Sign Up</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        <p className="text-center text-slate-500 text-sm mt-6">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}
