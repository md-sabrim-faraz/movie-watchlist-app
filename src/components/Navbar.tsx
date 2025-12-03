import { BookMarked, Film, LogIn, LogOut, Search } from "lucide-react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export function Navbar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate("/search");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 backdrop-blur-lg bg-opacity-95 border-b border-slate-700/50 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link
            to="/search"
            className="flex items-center space-x-2 cursor-pointer group"
          >
            <Film className="h-8 w-8 text-emerald-400 group-hover:text-emerald-300 transition-all duration-300 group-hover:rotate-12 group-hover:scale-110" />
            <span className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent group-hover:from-emerald-300 group-hover:to-cyan-300 transition-all duration-300">
              MovieWatch
            </span>
          </Link>

          <div className="flex items-center space-x-1 sm:space-x-2">
            <NavLink
              to="/search"
              className={({ isActive }) =>
                `flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 ${
                  isActive
                    ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/50"
                    : "text-slate-300 hover:bg-slate-700/50 hover:text-white"
                }`
              }
            >
              <Search className="h-5 w-5" />
              <span className="hidden sm:inline font-medium">Search</span>
            </NavLink>

            {user && (
              <NavLink
                to="/watchlist"
                className={({ isActive }) =>
                  `flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 ${
                    isActive
                      ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/50"
                      : "text-slate-300 hover:bg-slate-700/50 hover:text-white"
                  }`
                }
              >
                <BookMarked className="h-5 w-5" />
                <span className="hidden sm:inline font-medium">Watchlist</span>
              </NavLink>
            )}

            {user ? (
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg text-slate-300 hover:bg-red-500/20 hover:text-red-400 transition-all duration-300 transform hover:scale-105 border border-transparent hover:border-red-500/30"
              >
                <LogOut className="h-5 w-5" />
                <span className="hidden sm:inline font-medium">Logout</span>
              </button>
            ) : (
              <NavLink
                to="/login"
                className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 text-white hover:from-emerald-600 hover:to-cyan-600 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-emerald-500/30"
              >
                <LogIn className="h-5 w-5" />
                <span className="hidden sm:inline font-medium">Login</span>
              </NavLink>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
