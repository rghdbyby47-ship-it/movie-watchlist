const BASE_URL = 'https://api.themoviedb.org/3';
export const IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';
export const BACKDROP_BASE = 'https://image.tmdb.org/t/p/w1280';

function key(): string {
  return process.env.NEXT_PUBLIC_TMDB_API_KEY || '';
}

export async function searchMovies(query: string, page = 1) {
  const res = await fetch(
    `${BASE_URL}/search/movie?api_key=${key()}&query=${encodeURIComponent(query)}&page=${page}`
  );
  if (!res.ok) throw new Error('Failed to search movies');
  return res.json();
}

export async function getMovieById(id: string | number) {
  const res = await fetch(`${BASE_URL}/movie/${id}?api_key=${key()}`);
  if (!res.ok) throw new Error('Failed to fetch movie');
  return res.json();
}

export async function getPopularMovies(page = 1) {
  const res = await fetch(
    `${BASE_URL}/movie/popular?api_key=${key()}&page=${page}`
  );
  if (!res.ok) throw new Error('Failed to fetch popular movies');
  return res.json();
}

export async function getSimilarMovies(id: string | number) {
  const res = await fetch(
    `${BASE_URL}/movie/${id}/similar?api_key=${key()}`
  );
  if (!res.ok) throw new Error('Failed to fetch similar movies');
  return res.json();
}
