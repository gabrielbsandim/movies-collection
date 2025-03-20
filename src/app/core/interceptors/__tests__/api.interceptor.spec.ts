import { TestBed } from '@angular/core/testing'
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing'
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http'
import { MatSnackBarModule } from '@angular/material/snack-bar'
import { ApiInterceptor } from '@core/interceptors/api.interceptor'

const mockApiKey = 'mock-api-key'

describe('ApiInterceptor', () => {
  let httpClient: HttpClient
  let httpMock: HttpTestingController
  let interceptor: ApiInterceptor

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MatSnackBarModule],
      providers: [
        ApiInterceptor,
        provideHttpClient(
          withInterceptors([
            (req, next) => {
              const interceptor = TestBed.inject(ApiInterceptor)
              return interceptor.intercept(req, { handle: next })
            }
          ])
        ),
        provideHttpClientTesting()
      ]
    })

    httpClient = TestBed.inject(HttpClient)
    httpMock = TestBed.inject(HttpTestingController)
    interceptor = TestBed.inject(ApiInterceptor)

    spyOn<any>(interceptor, 'getApiKey').and.returnValue(mockApiKey)
  })

  afterEach(() => {
    httpMock.verify()
  })

  it('should add API key to requests to TheMovieDB API', () => {
    httpClient.get('https://api.themoviedb.org/3/movie/popular').subscribe()

    const req = httpMock.expectOne(
      req => req.url === 'https://api.themoviedb.org/3/movie/popular' && req.params.has('api_key')
    )

    expect(req.request.method).toBe('GET')
    expect(req.request.params.get('api_key')).toBe(mockApiKey)
  })

  it('should not add API key to requests to other domains', () => {
    httpClient.get('https://other-api.com/endpoint').subscribe()

    const req = httpMock.expectOne('https://other-api.com/endpoint')

    expect(req.request.method).toBe('GET')
    expect(req.request.params.has('api_key')).toBeFalse()
  })
})
