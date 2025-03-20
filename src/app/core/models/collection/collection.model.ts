import { IMovie } from '@core/models/movie/movie.model'

export interface ICollection {
  id: string
  name: string
  title: string
  description?: string
  movies: IMovie[]
  createdAt: Date
  updatedAt: Date
}

export interface ICollections {
  items: ICollection[]
}
