import { Injectable } from '@angular/core'
import { Observable, of, throwError } from 'rxjs'
import { catchError, map, shareReplay, tap } from 'rxjs/operators'
import { ApiService } from '@core/services/api/api.service'
import { IMovie, IMovies, TMovieFilter } from '@core/models/movie/movie.model'

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private cache: Map<string, { data: any; timestamp: number }> = new Map()
  private readonly CACHE_DURATION = 5 * 60 * 1000

  constructor(private apiService: ApiService) {}

  private getCacheKey(endpoint: string, params: any): string {
    return `${endpoint}?${Object.entries(params)
      .map(([key, value]) => `${key}=${value}`)
      .join('&')}`
  }

  private getFromCache<T>(cacheKey: string): T | null {
    if (!this.cache.has(cacheKey)) {
      return null
    }

    const cachedData = this.cache.get(cacheKey)
    if (!cachedData) return null

    const now = Date.now()
    if (now - cachedData.timestamp > this.CACHE_DURATION) {
      this.cache.delete(cacheKey)
      return null
    }

    return cachedData.data as T
  }

  private setCache<T>(cacheKey: string, data: T): void {
    this.cache.set(cacheKey, {
      data,
      timestamp: Date.now()
    })
  }

  searchMovies(query: string, page: number = 1): Observable<IMovies> {
    const params = { query, page }
    const cacheKey = this.getCacheKey('/search/movie', params)

    const cachedData = this.getFromCache<IMovies>(cacheKey)
    if (cachedData) {
      return of(cachedData)
    }

    return this.apiService.get<IMovies>('/search/movie', params).pipe(
      tap(data => this.setCache(cacheKey, data)),
      shareReplay(1),
      catchError(_error => {
        return throwError(() => new Error('Failed to search movies. Please try again later.'))
      })
    )
  }

  getMovieDetails(movieId: number): Observable<IMovie> {
    const cacheKey = this.getCacheKey(`/movie/${movieId}`, {})

    const cachedData = this.getFromCache<IMovie>(cacheKey)
    if (cachedData) {
      return of(cachedData)
    }

    return this.apiService.get<IMovie>(`/movie/${movieId}`).pipe(
      tap(data => this.setCache(cacheKey, data)),
      shareReplay(1),
      catchError(_error => {
        return throwError(() => new Error('Failed to load movie details. Please try again later.'))
      })
    )
  }

  getPopularMovies(page: number = 1): Observable<IMovies> {
    const params = { page }
    const cacheKey = this.getCacheKey('/movie/popular', params)

    const cachedData = this.getFromCache<IMovies>(cacheKey)
    if (cachedData) {
      return of(cachedData)
    }

    return this.apiService.get<IMovies>('/movie/popular', params).pipe(
      tap(data => this.setCache(cacheKey, data)),
      shareReplay(1),
      catchError(_error => {
        return throwError(() => new Error('Failed to load popular movies. Please try again later.'))
      })
    )
  }

  discoverMovies(filters: TMovieFilter, page: number = 1): Observable<IMovies> {
    const params: any = { page }

    if (filters.genre) params.with_genres = filters.genre
    if (filters.year) params.primary_release_year = filters.year
    if (filters.sortBy) params.sort_by = filters.sortBy
    if (filters.minRating) params.vote_average_gte = filters.minRating

    const cacheKey = this.getCacheKey('/discover/movie', params)

    const cachedData = this.getFromCache<IMovies>(cacheKey)
    if (cachedData) {
      return of(cachedData)
    }

    return this.apiService.get<IMovies>('/discover/movie', params).pipe(
      tap(data => this.setCache(cacheKey, data)),
      shareReplay(1),
      catchError(_error => {
        return throwError(() => new Error('Failed to discover movies. Please try again later.'))
      })
    )
  }

  getSimilarMovies(movieId: number, page: number = 1): Observable<IMovies> {
    const params = { page }
    const cacheKey = this.getCacheKey(`/movie/${movieId}/similar`, params)

    const cachedData = this.getFromCache<IMovies>(cacheKey)
    if (cachedData) {
      return of(cachedData)
    }

    return this.apiService.get<IMovies>(`/movie/${movieId}/similar`, params).pipe(
      tap(data => this.setCache(cacheKey, data)),
      shareReplay(1),
      catchError(_error => {
        return throwError(() => new Error('Failed to load similar movies. Please try again later.'))
      })
    )
  }

  getSessionId(): Observable<string> {
    return this.apiService
      .get<{ guest_session_id: string; expires_at: string }>('/authentication/guest_session/new')
      .pipe(
        map(response => response.guest_session_id),
        catchError(_error => {
          return throwError(
            () => new Error('Failed to create guest session. Please try again later.')
          )
        })
      )
  }

  rateMovie(movieId: number, rating: number, sessionId: string): Observable<{ success: boolean }> {
    const body = { value: rating }
    const params = { guest_session_id: sessionId }

    return this.apiService
      .post<{ success: boolean }>(`/movie/${movieId}/rating`, body, params)
      .pipe(
        catchError(_error => {
          return throwError(() => new Error('Failed to submit rating. Please try again.'))
        })
      )
  }
}
