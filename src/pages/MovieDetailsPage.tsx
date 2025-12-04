import { AlertCircle, ArrowLeft, Calendar, Star } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { LoadingSpinner } from "../components/LoadingSpinner";
import type { MovieDetails } from "../services/tmdb";
import {
  getBackdropUrl,
  getMovieDetails,
  getPosterUrl,
} from "../services/tmdb";

export function MovieDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const movieId = id || "";

  const handleBackdropError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src =
      "https://images.pexels.com/photos/390089/film-movie-motion-picture-390089.jpeg?auto=compress&cs=tinysrgb&w=1920";
  };

  const handlePosterError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src =
      "https://images.pexels.com/photos/390089/film-movie-motion-picture-390089.jpeg?auto=compress&cs=tinysrgb&w=500";
  };

  const loadMovieDetails = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const details = await getMovieDetails(movieId);
      setMovie(details);
    } catch (err) {
      console.error(err);
      setError("Failed to load movie details. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [movieId]);

  useEffect(() => {
    loadMovieDetails();
  }, [loadMovieDetails]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 pt-24 flex items-center justify-center">
        <LoadingSpinner message="Loading movie details..." size="lg" />
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 pt-24 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-24 w-24 text-red-500 mb-6 mx-auto" />
          <h2 className="text-2xl font-semibold text-slate-300 mb-2">
            Failed to Load Movie Details
          </h2>
          <p className="text-slate-500 max-w-md mb-6 mx-auto">
            {error || "Unable to fetch movie information"}
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={loadMovieDetails}
              className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-all duration-300"
            >
              Retry
            </button>
            <button
              onClick={() => navigate(-1)}
              className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-all duration-300"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  const year = movie.release_date
    ? new Date(movie.release_date).getFullYear()
    : "N/A";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="relative">
        <div className="absolute inset-0 h-[60vh] overflow-hidden">
          <img
            src={getBackdropUrl(movie.backdrop_path)}
            alt={movie.title}
            className="w-full h-full object-cover opacity-30 blur-sm"
            loading="lazy"
            onError={handleBackdropError}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950/40" />
        </div>

        <div className="relative pt-24 pb-12 px-4">
          <div className="max-w-7xl mx-auto">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-slate-300 hover:text-white mb-8 transition-all duration-300 transform hover:-translate-x-1 group"
            >
              <ArrowLeft className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
              <span className="font-medium">Back to Search</span>
            </button>

            <div className="grid md:grid-cols-[350px,1fr] gap-8 lg:gap-12">
              <div className="space-y-6">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500" />
                  <img
                    src={getPosterUrl(movie.poster_path, "w500")}
                    alt={movie.title}
                    className="relative w-full rounded-2xl shadow-2xl border border-slate-700 transform group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                    onError={handlePosterError}
                  />
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
                    {movie.title}
                  </h1>

                  <div className="flex flex-wrap gap-4 text-slate-300">
                    <div className="flex items-center gap-2 bg-slate-800/50 backdrop-blur-sm px-4 py-2 rounded-lg border border-slate-700">
                      <Calendar className="h-5 w-5 text-emerald-400" />
                      <span>{year}</span>
                    </div>
                    <div className="flex items-center gap-2 bg-slate-800/50 backdrop-blur-sm px-4 py-2 rounded-lg border border-slate-700">
                      <Star className="h-5 w-5 text-yellow-400" />
                      <span className="font-semibold">
                        {movie.vote_average.toFixed(1)}/10
                      </span>
                    </div>
                  </div>
                </div>

                {movie.genres.length > 0 && (
                  <div>
                    <h2 className="text-lg font-semibold text-slate-300 mb-3">
                      Genres
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      {movie.genres.map((genre) => (
                        <span
                          key={genre.id}
                          className="px-4 py-2 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border border-emerald-500/50 rounded-full text-emerald-300 text-sm font-medium backdrop-blur-sm"
                        >
                          {genre.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <h2 className="text-lg font-semibold text-slate-300 mb-3">
                    Overview
                  </h2>
                  <p className="text-slate-400 leading-relaxed text-lg">
                    {movie.overview || "No overview available."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
