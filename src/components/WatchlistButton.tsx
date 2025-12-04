import { Plus, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import * as watchlistService from "../services/watchlist";

interface WatchlistButtonProps {
  movieId: string;
  title: string;
  posterPath: string | null;
  releaseDate: string | null;
  variant?: "default" | "compact";
  className?: string;
}

export function WatchlistButton({
  movieId,
  title,
  posterPath,
  releaseDate,
  variant = "default",
  className = "",
}: WatchlistButtonProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      checkWatchlistStatus();
    } else {
      setIsInWatchlist(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, movieId]);

  const checkWatchlistStatus = async () => {
    if (!user) return;
    try {
      const inWatchlist = await watchlistService.isInWatchlist(movieId);
      setIsInWatchlist(inWatchlist);
    } catch (error) {
      console.error("Failed to check watchlist status:", error);
    }
  };

  const handleGuestClick = () => {
    // Redirect to login with context about the action and return path
    navigate("/login", {
      state: {
        from: location.pathname,
        action: "add-to-watchlist",
        movieId,
      },
    });
  };

  const handleAddToWatchlist = async () => {
    if (!user) {
      handleGuestClick();
      return;
    }

    setIsLoading(true);
    try {
      await watchlistService.addToWatchlist(
        movieId,
        title,
        posterPath,
        releaseDate
      );
      setIsInWatchlist(true);
    } catch (error) {
      console.error("Failed to add to watchlist:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveFromWatchlist = async () => {
    if (!user) {
      handleGuestClick();
      return;
    }

    setIsLoading(true);
    try {
      await watchlistService.removeFromWatchlist(movieId);
      setIsInWatchlist(false);
    } catch (error) {
      console.error("Failed to remove from watchlist:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Guest user button
  if (!user) {
    return (
      <button
        onClick={handleGuestClick}
        disabled={isLoading}
        className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg transition-all duration-300 transform hover:scale-105 border font-medium text-sm bg-cyan-500/10 hover:bg-cyan-500 text-cyan-400 hover:text-white border-cyan-500/50 hover:border-cyan-400 hover:shadow-lg hover:shadow-cyan-500/30 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      >
        <Plus className="h-4 w-4" />
        <span>{variant === "compact" ? "Watchlist" : "Add to Watchlist"}</span>
      </button>
    );
  }

  // Authenticated user - in watchlist
  if (isInWatchlist) {
    return (
      <button
        onClick={handleRemoveFromWatchlist}
        disabled={isLoading}
        className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg transition-all duration-300 transform hover:scale-105 border font-medium text-sm bg-emerald-500/20 text-emerald-400 border-emerald-500/50 hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/50 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      >
        {isLoading ? (
          <>
            <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            <span>{variant === "compact" ? "..." : "Removing..."}</span>
          </>
        ) : (
          <>
            <X className="h-4 w-4" />
            <span>
              {variant === "compact" ? "Remove" : "Remove from Watchlist"}
            </span>
          </>
        )}
      </button>
    );
  }

  // Authenticated user - not in watchlist
  return (
    <button
      onClick={handleAddToWatchlist}
      disabled={isLoading}
      className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg transition-all duration-300 transform hover:scale-105 border font-medium text-sm bg-cyan-500/10 hover:bg-cyan-500 text-cyan-400 hover:text-white border-cyan-500/50 hover:border-cyan-400 hover:shadow-lg hover:shadow-cyan-500/30 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {isLoading ? (
        <>
          <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          <span>{variant === "compact" ? "..." : "Adding..."}</span>
        </>
      ) : (
        <>
          <Plus className="h-4 w-4" />
          <span>
            {variant === "compact" ? "Watchlist" : "Add to Watchlist"}
          </span>
        </>
      )}
    </button>
  );
}
