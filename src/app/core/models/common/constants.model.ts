export type TMovieSortBy =
  | 'popularity.desc'
  | 'release_date.desc'
  | 'revenue.desc'
  | 'primary_release_date.desc'
  | 'original_title.asc'
  | 'vote_average.desc'
  | 'vote_count.desc'

export const movieSortByValues: Record<string, TMovieSortBy> = {
  popularity: 'popularity.desc',
  releaseDate: 'release_date.desc',
  revenue: 'revenue.desc',
  primaryReleaseDate: 'primary_release_date.desc',
  originalTitle: 'original_title.asc',
  voteAverage: 'vote_average.desc',
  voteCount: 'vote_count.desc'
}

export type TStorageKey = 'collections' | 'session_id' | 'session_timestamp' | 'theme' | 'language'

export const storageKeys: Record<string, TStorageKey> = {
  collections: 'collections',
  sessionId: 'session_id',
  sessionTimestamp: 'session_timestamp',
  theme: 'theme',
  language: 'language'
}

export type TAppRoute = 'movie' | 'collections' | 'collections/detail' | 'collections/create'

export const routes: Record<string, TAppRoute> = {
  home: 'movie',
  movieDetails: 'movie',
  collections: 'collections',
  collectionDetails: 'collections/detail',
  collectionCreate: 'collections/create'
}

export type TTheme = 'light-theme' | 'dark-theme'

export const themes: Record<string, TTheme> = {
  light: 'light-theme',
  dark: 'dark-theme'
}

export type TLanguage = 'en-US' | 'pt-BR' | 'es-ES'

export const languages: Record<string, TLanguage> = {
  en: 'en-US',
  pt: 'pt-BR',
  es: 'es-ES'
}
