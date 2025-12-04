import * as auth from "../lib/auth";
import * as storage from "../lib/storage";
import type { WatchlistItem } from "../lib/types";

export const addToWatchlist = async (
  movieId: string,
  title: string,
  posterPath: string | null,
  releaseDate: string | null
) => {
  const user = auth.getCurrentUser();
  if (!user) throw new Error("User not authenticated");

  const data = storage.addToWatchlist(
    user.id,
    movieId,
    title,
    posterPath,
    releaseDate
  );
  return data;
};

export const removeFromWatchlist = async (movieId: string) => {
  const user = auth.getCurrentUser();
  if (!user) throw new Error("User not authenticated");

  storage.removeFromWatchlist(user.id, movieId);
};

export const getWatchlist = async (): Promise<WatchlistItem[]> => {
  const user = auth.getCurrentUser();
  if (!user) return [];

  const data = storage.getWatchlist(user.id);
  return data || [];
};

export const isInWatchlist = async (movieId: string): Promise<boolean> => {
  const user = auth.getCurrentUser();
  if (!user) return false;

  return storage.isInWatchlist(user.id, movieId);
};
