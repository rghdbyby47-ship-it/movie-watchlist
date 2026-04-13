import { User, WatchLog, MovieList } from './types';

const KEYS = {
  USERS: 'lbp_users',
  CURRENT_USER: 'lbp_current_user',
  WATCH_LOGS: 'lbp_watch_logs',
  LISTS: 'lbp_lists',
};

// ---------- Users ----------

export function getUsers(): User[] {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(KEYS.USERS);
  return data ? JSON.parse(data) : [];
}

function saveUsers(users: User[]): void {
  localStorage.setItem(KEYS.USERS, JSON.stringify(users));
}

export function getCurrentUser(): User | null {
  if (typeof window === 'undefined') return null;
  const data = localStorage.getItem(KEYS.CURRENT_USER);
  return data ? JSON.parse(data) : null;
}

export function setCurrentUser(user: User | null): void {
  if (user) {
    localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(user));
  } else {
    localStorage.removeItem(KEYS.CURRENT_USER);
  }
}

export function createUser(email: string, nickname: string, password: string): User {
  const users = getUsers();
  const user: User = {
    id: Date.now().toString(),
    email,
    nickname,
    password,
    createdAt: new Date().toISOString(),
    topMovies: [],
  };
  users.push(user);
  saveUsers(users);
  return user;
}

export function updateUser(updatedUser: User): void {
  const users = getUsers();
  const index = users.findIndex((u) => u.id === updatedUser.id);
  if (index !== -1) {
    users[index] = updatedUser;
    saveUsers(users);
  }
  const current = getCurrentUser();
  if (current && current.id === updatedUser.id) {
    setCurrentUser(updatedUser);
  }
}

export function getUserByNickname(nickname: string): User | undefined {
  return getUsers().find(
    (u) => u.nickname.toLowerCase() === nickname.toLowerCase()
  );
}

// ---------- Watch Logs ----------

export function getWatchLogs(): WatchLog[] {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(KEYS.WATCH_LOGS);
  return data ? JSON.parse(data) : [];
}

function saveWatchLogs(logs: WatchLog[]): void {
  localStorage.setItem(KEYS.WATCH_LOGS, JSON.stringify(logs));
}

export function getUserWatchLogs(userId: string): WatchLog[] {
  return getWatchLogs()
    .filter((l) => l.userId === userId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function getWatchLogForMovie(
  userId: string,
  movieId: string
): WatchLog | undefined {
  return getWatchLogs().find(
    (l) => l.userId === userId && l.movieId === movieId
  );
}

export function addOrUpdateWatchLog(
  log: Omit<WatchLog, 'id' | 'createdAt'> & { id?: string; createdAt?: string }
): WatchLog {
  const logs = getWatchLogs();
  const existingIndex = logs.findIndex(
    (l) => l.userId === log.userId && l.movieId === log.movieId
  );

  if (existingIndex !== -1) {
    logs[existingIndex] = {
      ...logs[existingIndex],
      userRating: log.userRating,
      review: log.review,
    };
    saveWatchLogs(logs);
    return logs[existingIndex];
  }

  const newLog: WatchLog = {
    ...log,
    id: log.id || Date.now().toString(),
    createdAt: log.createdAt || new Date().toISOString(),
  };
  logs.push(newLog);
  saveWatchLogs(logs);
  return newLog;
}

export function deleteWatchLog(userId: string, movieId: string): void {
  saveWatchLogs(
    getWatchLogs().filter(
      (l) => !(l.userId === userId && l.movieId === movieId)
    )
  );
}

// ---------- Lists ----------

export function getLists(): MovieList[] {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(KEYS.LISTS);
  return data ? JSON.parse(data) : [];
}

function saveLists(lists: MovieList[]): void {
  localStorage.setItem(KEYS.LISTS, JSON.stringify(lists));
}

export function getUserLists(userId: string): MovieList[] {
  return getLists().filter((l) => l.userId === userId);
}

export function getListById(id: string): MovieList | undefined {
  return getLists().find((l) => l.id === id);
}

export function createList(
  userId: string,
  userNickname: string,
  name: string,
  description?: string
): MovieList {
  const lists = getLists();
  const list: MovieList = {
    id: Date.now().toString(),
    userId,
    userNickname,
    name,
    description,
    movies: [],
    createdAt: new Date().toISOString(),
    isPublic: true,
  };
  lists.push(list);
  saveLists(lists);
  return list;
}

export function updateList(updatedList: MovieList): void {
  const lists = getLists();
  const index = lists.findIndex((l) => l.id === updatedList.id);
  if (index !== -1) {
    lists[index] = updatedList;
    saveLists(lists);
  }
}

export function deleteList(listId: string): void {
  saveLists(getLists().filter((l) => l.id !== listId));
}

export function addMovieToList(
  listId: string,
  movie: { movieId: string; title: string; posterPath?: string; year?: number }
): void {
  const lists = getLists();
  const list = lists.find((l) => l.id === listId);
  if (list && !list.movies.find((m) => m.movieId === movie.movieId)) {
    list.movies.push({ ...movie, addedAt: new Date().toISOString() });
    saveLists(lists);
  }
}

export function removeMovieFromList(listId: string, movieId: string): void {
  const lists = getLists();
  const list = lists.find((l) => l.id === listId);
  if (list) {
    list.movies = list.movies.filter((m) => m.movieId !== movieId);
    saveLists(lists);
  }
}
