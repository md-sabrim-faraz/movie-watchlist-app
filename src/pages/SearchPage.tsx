import { AlertCircle, Film, Search as SearchIcon } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { WatchlistButton } from "../components/WatchlistButton";
import { useAuth } from "../contexts/AuthContext";
import { isInWatchlist } from "../lib/storage";
import {
  getPopularMovies,
  getPosterUrl,
  searchMovies,
  type Movie,
} from "../services/tmdb";

export function SearchPage() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [watchlistMovieIds, setWatchlistMovieIds] = useState<Set<string>>(
    new Set()
  );
  const { user } = useAuth();
  const navigate = useNavigate();

  // Load popular movies on initial mount
  useEffect(() => {
    fetchPopularMovies();
  }, []);

  // Update watchlist status when user or movies change
  useEffect(() => {
    if (user && movies.length > 0) {
      loadWatchlistStatus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, movies]);

  const fetchPopularMovies = async () => {
    try {
      setLoading(true);
      setError(null);
      const popularMovies = await getPopularMovies();
      setMovies(popularMovies);
    } catch (err) {
      setError("Failed to load movies. Please try again later.");
      console.error("Error fetching popular movies:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadWatchlistStatus = () => {
    if (!user) return;

    const ids = new Set<string>();
    for (const movie of movies) {
      const movieIdStr = String(movie.id);
      const inWatchlist = isInWatchlist(user.id, movieIdStr);
      if (inWatchlist) {
        ids.add(movieIdStr);
      }
    }
    setWatchlistMovieIds(ids);
  };

  // Search function that can be called for retry
  const performSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      // If query is empty, reload popular movies
      fetchPopularMovies();
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const results = await searchMovies(searchQuery);
      setMovies(results);
      setError(null);
    } catch (error) {
      console.error("Search failed:", error);
      setMovies([]);
      setError("Failed to search movies. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounced search effect
  useEffect(() => {
    // Handle empty query state - don't search, keep popular movies
    if (!query.trim()) {
      return;
    }

    // Set loading state
    setLoading(true);
    setError(null);

    // Implement 300ms debounce
    const timeoutId = setTimeout(() => {
      performSearch(query);
    }, 300);

    // Cleanup function to cancel previous timeout
    return () => {
      clearTimeout(timeoutId);
    };
  }, [query, performSearch]);

  const handleViewDetails = (id: number) => {
    navigate(`/movie/${id}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 pt-24 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent min-h-[4rem]">
            Discover Movies
          </h1>
          <p className="text-slate-400 text-lg min-h-[1.75rem]">
            {query.trim()
              ? "Find your next favorite film"
              : "Browse our collection and build your perfect watchlist"}
          </p>
        </div>

        <div className="mb-12 max-w-3xl mx-auto">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500" />
            <div className="relative flex items-center bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-slate-700 group-hover:border-emerald-500/50 transition-all duration-300 shadow-2xl">
              <SearchIcon className="absolute left-5 h-6 w-6 text-slate-400 group-hover:text-emerald-400 transition-colors duration-300" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by title..."
                className="w-full bg-transparent text-white placeholder-slate-400 pl-14 pr-6 py-5 text-lg focus:outline-none"
              />
            </div>
          </div>
        </div>

        {error ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <AlertCircle className="h-24 w-24 text-red-500 mb-6" />
            <h2 className="text-2xl font-semibold text-slate-300 mb-2">
              {query.trim() ? "Search Failed" : "Error Loading Movies"}
            </h2>
            <p className="text-slate-500 max-w-md mb-6">{error}</p>
            <button
              onClick={() =>
                query.trim() ? performSearch(query) : fetchPopularMovies()
              }
              className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-emerald-500/50 transition-all duration-300"
            >
              Retry
            </button>
          </div>
        ) : loading ? (
          <LoadingSpinner
            message={
              query.trim() ? "Searching movies..." : "Loading popular movies..."
            }
            size="lg"
          />
        ) : movies.length > 0 ? (
          <>
            {query.trim() && (
              <div className="text-slate-400 text-center mb-6">
                Found {movies.length} result{movies.length !== 1 ? "s" : ""}
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fade-in">
              {movies.map((movie, index) => {
                const year = movie.release_date
                  ? new Date(movie.release_date).getFullYear()
                  : "N/A";
                const posterSrc = movie.poster_path
                  ? getPosterUrl(movie.poster_path, "w342")
                  : "https://images.pexels.com/photos/390089/film-movie-motion-picture-390089.jpeg?auto=compress&cs=tinysrgb&w=400";
                const rating = movie.vote_average;
                const isInWatchlistStatus = watchlistMovieIds.has(
                  String(movie.id)
                );

                return (
                  <div
                    key={movie.id}
                    style={{
                      animation: `fadeInUp 0.5s ease-out ${index * 0.05}s both`,
                    }}
                    className="group relative bg-slate-800/50 backdrop-blur-sm rounded-xl overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-emerald-500/20 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 border border-slate-700/50 hover:border-emerald-500/50"
                  >
                    <div className="relative aspect-[2/3] overflow-hidden">
                      <img
                        src={posterSrc}
                        alt={movie.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.src =
                            "https://images.pexels.com/photos/390089/film-movie-motion-picture-390089.jpeg?auto=compress&cs=tinysrgb&w=400";
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />

                      {rating > 0 && (
                        <div className="absolute top-3 right-3 bg-slate-900/90 backdrop-blur-sm px-3 py-1 rounded-full border border-emerald-500/30">
                          <span className="text-emerald-400 font-bold text-sm flex items-center">
                            ⭐ {rating.toFixed(1)}
                          </span>
                        </div>
                      )}

                      {/* Show watchlist status indicator only for authenticated users */}
                      {user && isInWatchlistStatus && (
                        <div className="absolute top-3 left-3 bg-emerald-500/90 backdrop-blur-sm px-3 py-1 rounded-full border border-emerald-400/50">
                          <span className="text-white font-bold text-xs">
                            ✓ In Watchlist
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="p-4 space-y-3">
                      <div>
                        <h3 className="text-lg font-bold text-white line-clamp-2 group-hover:text-emerald-400 transition-colors duration-300">
                          {movie.title}
                        </h3>
                        <p className="text-slate-400 text-sm mt-1">{year}</p>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleViewDetails(movie.id)}
                          className="flex-1 flex items-center justify-center gap-2 bg-slate-700/50 hover:bg-emerald-500 text-white px-4 py-2.5 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-emerald-500/30 border border-slate-600 hover:border-emerald-400"
                        >
                          <Film className="h-4 w-4" />
                          <span className="font-medium text-sm">Details</span>
                        </button>

                        <WatchlistButton
                          movieId={String(movie.id)}
                          title={movie.title}
                          posterPath={movie.poster_path}
                          releaseDate={movie.release_date}
                          variant="compact"
                          className="flex-1"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Film className="h-24 w-24 text-slate-700 mb-6" />
            <h2 className="text-2xl font-semibold text-slate-300 mb-2">
              No Movies Found
            </h2>
            <p className="text-slate-500 max-w-md">
              Try adjusting your search terms to find what you're looking for
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
