export interface User {
  id: string;
  email: string;
  nickname: string;
  password: string;
  createdAt: string;
  pfp?: string;
  topMovies?: string[];
}

export interface WatchLog {
  id: string;
  userId: string;
  movieId: string;
  movieTitle: string;
  moviePoster?: string;
  movieYear?: number;
  userRating: number;
  review?: string;
  createdAt: string;
}

export interface MovieList {
  id: string;
  userId: string;
  userNickname: string;
  name: string;
  description?: string;
  movies: ListMovie[];
  createdAt: string;
  isPublic: boolean;
}

export interface ListMovie {
  movieId: string;
  title: string;
  posterPath?: string;
  year?: number;
  addedAt: string;
}

export interface TMDBMovie {
  id: number;
  title: string;
  overview: string;
  release_date: string;
  genre_ids: number[];
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  vote_count: number;
}

export interface TMDBMovieDetail {
  id: number;
  title: string;
  overview: string;
  release_date: string;
  genres: { id: number; name: string }[];
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  runtime: number;
  tagline: string;
}
