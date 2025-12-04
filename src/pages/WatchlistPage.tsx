import { BookMarked, Loader2, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { LoadingSpinner } from "../components/LoadingSpinner";
import type { WatchlistItem } from "../lib/types";
import { getPosterUrl } from "../services/tmdb";
import { getWatchlist, removeFromWatchlist } from "../services/watchlist";

export function WatchlistPage() {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState<string | null>(null);

  useEffect(() => {
    loadWatchlist();
  }, []);

  const loadWatchlist = async () => {
    setLoading(true);
    try {
      const items = await getWatchlist();
      setWatchlist(items);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (movieId: string) => {
    setRemovingId(movieId);
    try {
      await removeFromWatchlist(movieId);
      setWatchlist((prev) => prev.filter((item) => item.movie_id !== movieId));
    } catch (err) {
      alert("Failed to remove from watchlist");
      console.error(err);
    } finally {
      setRemovingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 pt-24 flex items-center justify-center">
        <LoadingSpinner message="Loading your watchlist..." size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 pt-24 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-4">
            <BookMarked className="h-12 w-12 text-emerald-400" />
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
              My Watchlist
            </h1>
          </div>
          <p className="text-slate-400 text-lg">
            {watchlist.length === 0
              ? "Your watchlist is empty. Start adding movies!"
              : `${watchlist.length} movie${
                  watchlist.length === 1 ? "" : "s"
                } waiting to be watched`}
          </p>
        </div>

        {watchlist.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <BookMarked className="h-24 w-24 text-slate-700 mb-6" />
            <h2 className="text-2xl font-semibold text-slate-300 mb-2">
              No Movies Yet
            </h2>
            <p className="text-slate-500 max-w-md">
              Search for movies and click the "+ Watchlist" button to start
              building your collection
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fade-in">
            {watchlist.map((item, index) => {
              const year = item.release_date
                ? new Date(item.release_date).getFullYear()
                : "N/A";

              return (
                <div
                  key={item.id}
                  className="group relative bg-slate-800/50 backdrop-blur-sm rounded-xl overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-emerald-500/20 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 border border-slate-700/50 hover:border-emerald-500/50"
                  style={{
                    animation: `fadeInUp 0.5s ease-out ${index * 0.05}s both`,
                  }}
                >
                  <div className="relative aspect-[2/3] overflow-hidden">
                    <img
                      src={getPosterUrl(item.poster_path, "w342")}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
                  </div>

                  <div className="p-4 space-y-3">
                    <div>
                      <h3 className="text-lg font-bold text-white line-clamp-2 group-hover:text-emerald-400 transition-colors duration-300">
                        {item.title}
                      </h3>
                      <p className="text-slate-400 text-sm mt-1">{year}</p>
                    </div>

                    <button
                      onClick={() => handleRemove(item.movie_id)}
                      disabled={removingId === item.movie_id}
                      className="w-full flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white px-4 py-2.5 rounded-lg transition-all duration-300 transform hover:scale-105 border border-red-500/50 hover:border-red-400 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-red-500/30"
                    >
                      {removingId === item.movie_id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          <Trash2 className="h-4 w-4" />
                          <span className="font-medium text-sm">Remove</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
