import { supabase } from './supabase';

// ---------- Profiles ----------

export async function getProfileByNickname(nickname: string) {
  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('nickname', nickname)
    .single();
  return data;
}

// ---------- Watch Logs ----------

export async function getUserWatchLogs(userId: string) {
  const { data } = await supabase
    .from('watch_logs')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  return data || [];
}

export async function getWatchLogForMovie(userId: string, movieId: string) {
  const { data } = await supabase
    .from('watch_logs')
    .select('*')
    .eq('user_id', userId)
    .eq('movie_id', movieId)
    .maybeSingle();
  return data;
}

export async function upsertWatchLog(log: {
  user_id: string;
  movie_id: string;
  movie_title: string;
  movie_poster?: string;
  movie_year?: number;
  user_rating: number;
  review?: string;
}) {
  const { data } = await supabase
    .from('watch_logs')
    .upsert(log, { onConflict: 'user_id,movie_id' })
    .select()
    .single();
  return data;
}

export async function deleteWatchLog(userId: string, movieId: string) {
  await supabase
    .from('watch_logs')
    .delete()
    .eq('user_id', userId)
    .eq('movie_id', movieId);
}

// ---------- Lists ----------

export async function getUserLists(userId: string) {
  const { data } = await supabase
    .from('lists')
    .select('*, list_movies(*)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  return data || [];
}

export async function getListById(listId: string) {
  const { data } = await supabase
    .from('lists')
    .select('*, list_movies(*)')
    .eq('id', listId)
    .single();
  return data;
}

export async function createList(userId: string, userNickname: string, name: string, description?: string) {
  const { data } = await supabase
    .from('lists')
    .insert({ user_id: userId, user_nickname: userNickname, name, description, is_public: true })
    .select()
    .single();
  return data;
}

export async function deleteList(listId: string) {
  await supabase.from('lists').delete().eq('id', listId);
}

export async function addMovieToList(listId: string, movie: {
  movie_id: string;
  title: string;
  poster_path?: string;
  year?: number;
}) {
  await supabase
    .from('list_movies')
    .upsert({ list_id: listId, ...movie }, { onConflict: 'list_id,movie_id' });
}

export async function removeMovieFromList(listId: string, movieId: string) {
  await supabase
    .from('list_movies')
    .delete()
    .eq('list_id', listId)
    .eq('movie_id', movieId);
}
