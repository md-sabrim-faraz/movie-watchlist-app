const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const TMDB_BASE_URL =
  import.meta.env.VITE_TMDB_BASE_URL || "https://api.themoviedb.org/3";
const TMDB_IMAGE_BASE_URL =
  import.meta.env.VITE_TMDB_IMAGE_BASE_URL || "https://image.tmdb.org/t/p";

// Validate API key is configured
if (!TMDB_API_KEY) {
  console.error(
    "TMDB API key is not configured. Please set VITE_TMDB_API_KEY in your .env file."
  );
}

export interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  overview: string;
  release_date: string;
  vote_average: number;
  genre_ids?: number[];
}

export interface MovieDetails extends Movie {
  genres: { id: number; name: string }[];
  runtime: number;
  status: string;
  tagline: string;
}

export const getPosterUrl = (
  path: string | null,
  size: "w185" | "w342" | "w500" | "original" = "w342"
) => {
  if (!path)
    return "https://images.pexels.com/photos/390089/film-movie-motion-picture-390089.jpeg?auto=compress&cs=tinysrgb&w=400";
  return `${TMDB_IMAGE_BASE_URL}/${size}${path}`;
};

export const getBackdropUrl = (
  path: string | null,
  size: "w780" | "w1280" | "original" = "w1280"
) => {
  if (!path)
    return "https://images.pexels.com/photos/390089/film-movie-motion-picture-390089.jpeg?auto=compress&cs=tinysrgb&w=1260";
  return `${TMDB_IMAGE_BASE_URL}/${size}${path}`;
};

export const searchMovies = async (query: string): Promise<Movie[]> => {
  if (!query.trim()) return [];

  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(
        query
      )}&page=1`
    );

    if (!response.ok) throw new Error("Failed to search movies");

    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error("Error searching movies:", error);
    return [];
  }
};

export const getMovieDetails = async (
  movieId: string
): Promise<MovieDetails | null> => {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/movie/${movieId}?api_key=${TMDB_API_KEY}`
    );

    if (!response.ok) throw new Error("Failed to fetch movie details");

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching movie details:", error);
    return null;
  }
};

export const getPopularMovies = async (page: number = 1): Promise<Movie[]> => {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&page=${page}`
    );

    if (!response.ok) throw new Error("Failed to fetch popular movies");

    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error("Error fetching popular movies:", error);
    return [];
  }
};
