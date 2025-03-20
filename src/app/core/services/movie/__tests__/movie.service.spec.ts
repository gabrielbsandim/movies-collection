import { TestBed } from '@angular/core/testing'
import { MovieService } from '@core/services/movie/movie.service'
import { ApiService } from '@core/services/api/api.service'
import { of, throwError } from 'rxjs'
import { IMovie, IMovies } from '@core/models/movie/movie.model'

describe('MovieService', () => {
  let service: MovieService
  let apiServiceSpy: jasmine.SpyObj<ApiService>

  beforeEach(() => {
    const spy = jasmine.createSpyObj('ApiService', ['get', 'post'])

    TestBed.configureTestingModule({
      providers: [MovieService, { provide: ApiService, useValue: spy }]
    })

    service = TestBed.inject(MovieService)
    apiServiceSpy = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })

  describe('searchMovies', () => {
    const mockMoviesResponse: IMovies = {
      page: 1,
      results: [
        {
          id: 1,
          title: 'Test Movie 1',
          poster_path: '/path1.jpg',
          overview: 'Test overview 1',
          release_date: '2022-01-01'
        },
        {
          id: 2,
          title: 'Test Movie 2',
          poster_path: '/path2.jpg',
          overview: 'Test overview 2',
          release_date: '2022-02-02'
        }
      ],
      total_pages: 1,
      total_results: 2
    }

    it('should return movies from API when not cached', () => {
      apiServiceSpy.get.and.returnValue(of(mockMoviesResponse))

      service.searchMovies('test').subscribe(movies => {
        expect(movies).toEqual(mockMoviesResponse)
        expect(apiServiceSpy.get).toHaveBeenCalledWith('/search/movie', { query: 'test', page: 1 })
      })
    })

    it('should return cached movies on subsequent calls', () => {
      apiServiceSpy.get.and.returnValue(of(mockMoviesResponse))

      service.searchMovies('test').subscribe()
      service.searchMovies('test').subscribe()

      expect(apiServiceSpy.get).toHaveBeenCalledTimes(1)
    })

    it('should handle errors when searching movies', () => {
      apiServiceSpy.get.and.returnValue(throwError(() => new Error('API error')))

      service.searchMovies('test').subscribe({
        next: () => fail('Expected error but got response'),
        error: error => {
          expect(error.message).toContain('Failed to search movies')
        }
      })
    })
  })

  describe('getMovieDetails', () => {
    const mockMovie: IMovie = {
      id: 1,
      title: 'Test Movie',
      overview: 'This is a test movie',
      poster_path: '/path.jpg',
      release_date: '2022-01-01'
    }

    it('should return movie details from API when not cached', () => {
      apiServiceSpy.get.and.returnValue(of(mockMovie))

      service.getMovieDetails(1).subscribe(movie => {
        expect(movie).toEqual(mockMovie)
        expect(apiServiceSpy.get).toHaveBeenCalledWith('/movie/1')
      })
    })

    it('should return cached movie details on subsequent calls', () => {
      apiServiceSpy.get.and.returnValue(of(mockMovie))

      service.getMovieDetails(1).subscribe()
      service.getMovieDetails(1).subscribe()

      expect(apiServiceSpy.get).toHaveBeenCalledTimes(1)
    })

    it('should handle errors when fetching movie details', () => {
      apiServiceSpy.get.and.returnValue(throwError(() => new Error('API error')))

      service.getMovieDetails(1).subscribe({
        next: () => fail('Expected error but got response'),
        error: error => {
          expect(error.message).toContain('Failed to load movie details')
        }
      })
    })
  })

  describe('rateMovie', () => {
    const mockRatingResponse = { success: true, status_code: 200 }

    it('should send rating request to API', () => {
      apiServiceSpy.post.and.returnValue(of(mockRatingResponse))

      service.rateMovie(1, 8.5, 'test-session').subscribe(response => {
        expect(response).toEqual(mockRatingResponse)
        expect(apiServiceSpy.post).toHaveBeenCalledWith(
          '/movie/1/rating',
          { value: 8.5 },
          { guest_session_id: 'test-session' }
        )
      })
    })

    it('should handle errors when rating a movie', () => {
      apiServiceSpy.post.and.returnValue(throwError(() => new Error('API error')))

      service.rateMovie(1, 8.5, 'test-session').subscribe({
        next: () => fail('Expected error but got response'),
        error: error => {
          expect(error.message).toContain('Failed to submit rating')
        }
      })
    })
  })

  describe('getSessionId', () => {
    it('should return guest session ID from API', () => {
      apiServiceSpy.get.and.returnValue(of({ guest_session_id: 'test-session-id' }))

      service.getSessionId().subscribe(sessionId => {
        expect(sessionId).toEqual('test-session-id')
        expect(apiServiceSpy.get).toHaveBeenCalledWith('/authentication/guest_session/new')
      })
    })

    it('should handle errors when getting session ID', () => {
      apiServiceSpy.get.and.returnValue(throwError(() => new Error('API error')))

      service.getSessionId().subscribe({
        next: () => fail('Expected error but got response'),
        error: error => {
          expect(error.message).toContain('Failed to create guest session')
        }
      })
    })
  })
})
