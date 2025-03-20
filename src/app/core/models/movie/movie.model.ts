import { TMovieSortBy } from '@core/models/common/constants.model'

export interface IMovie {
  id: number
  title: string
  overview: string
  poster_path: string
  budget?: number
  release_date?: string
  revenue?: number
  vote_average?: number
  vote_count?: number
  runtime?: number
  original_title?: string
  original_language?: string
  popularity?: number
  status?: string
  homepage?: string
  imdb_id?: string
  spoken_languages?: {
    english_name: string
    iso_639_1: string
    name: string
  }[]
  genres?: IGenre[]
  production_companies?: {
    id: number
    name: string
    logo_path: string | null
    origin_country: string
  }[]
  production_countries?: {
    iso_3166_1: string
    name: string
  }[]
}

export interface IMovies {
  results: IMovie[]
  total_pages: number
  total_results: number
  page: number
}

export interface IGenre {
  id: number
  name: string
}

export type TMovieFilter = {
  genre?: number
  year?: number
  sortBy?: TMovieSortBy
  minRating?: number
}
