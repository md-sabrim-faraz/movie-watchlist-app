export interface User {
  id: string;
  email: string;
}

export interface Session {
  user: User;
  access_token: string;
}

export interface WatchlistItem {
  id: string;
  user_id: string;
  movie_id: string;
  title: string;
  poster_path: string | null;
  release_date: string | null;
  created_at: string;
}
