import type { WatchlistItem } from "./types";

const WATCHLIST_KEY = "watchlist";

const generateId = () => Math.random().toString(36).substring(2, 15);

function getStoredWatchlist(): WatchlistItem[] {
  const stored = localStorage.getItem(WATCHLIST_KEY);
  return stored ? JSON.parse(stored) : [];
}

function saveWatchlist(items: WatchlistItem[]): void {
  localStorage.setItem(WATCHLIST_KEY, JSON.stringify(items));
}

export function addToWatchlist(
  userId: string,
  movieId: string,
  title: string,
  posterPath: string | null,
  releaseDate: string | null
): WatchlistItem {
  const items = getStoredWatchlist();

  // Check if already in watchlist
  if (
    items.some((item) => item.user_id === userId && item.movie_id === movieId)
  ) {
    return items.find(
      (item) => item.user_id === userId && item.movie_id === movieId
    )!;
  }

  const newItem: WatchlistItem = {
    id: generateId(),
    user_id: userId,
    movie_id: movieId,
    title,
    poster_path: posterPath,
    release_date: releaseDate,
    created_at: new Date().toISOString(),
  };

  items.push(newItem);
  saveWatchlist(items);
  return newItem;
}

export function removeFromWatchlist(userId: string, movieId: string): void {
  const items = getStoredWatchlist();
  const filtered = items.filter(
    (item) => !(item.user_id === userId && item.movie_id === movieId)
  );
  saveWatchlist(filtered);
}

export function getWatchlist(userId: string): WatchlistItem[] {
  const items = getStoredWatchlist();
  return items
    .filter((item) => item.user_id === userId)
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
}

export function isInWatchlist(userId: string, movieId: string): boolean {
  const items = getStoredWatchlist();
  return items.some(
    (item) => item.user_id === userId && item.movie_id === movieId
  );
}
