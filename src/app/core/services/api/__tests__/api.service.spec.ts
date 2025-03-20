import { TestBed } from '@angular/core/testing'
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing'
import { provideHttpClient } from '@angular/common/http'
import { ApiService } from '@core/services/api/api.service'

describe('ApiService', () => {
  let service: ApiService
  let httpMock: HttpTestingController

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ApiService, provideHttpClient(), provideHttpClientTesting()]
    })

    service = TestBed.inject(ApiService)
    httpMock = TestBed.inject(HttpTestingController)
  })

  afterEach(() => {
    httpMock.verify()
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })

  it('should make GET request with correct URL and parameters', () => {
    const mockResponse = { results: [] }
    const endpoint = '/search/movie'
    const params = { query: 'test', page: 1 }

    service.get(endpoint, params).subscribe(response => {
      expect(response).toEqual(mockResponse)
    })

    const req = httpMock.expectOne(
      req =>
        req.url === `https://api.themoviedb.org/3${endpoint}` &&
        req.params.get('query') === 'test' &&
        req.params.get('page') === '1'
    )

    expect(req.request.method).toBe('GET')
    req.flush(mockResponse)
  })

  it('should make POST request with correct URL, body and parameters', () => {
    const mockResponse = { success: true }
    const endpoint = '/movie/123/rating'
    const body = { value: 8.5 }
    const params = { guest_session_id: 'test-session' }

    service.post(endpoint, body, params).subscribe(response => {
      expect(response).toEqual(mockResponse)
    })

    const req = httpMock.expectOne(
      req =>
        req.url === `https://api.themoviedb.org/3${endpoint}` &&
        req.params.get('guest_session_id') === 'test-session'
    )

    expect(req.request.method).toBe('POST')
    expect(req.request.body).toEqual(body)
    req.flush(mockResponse)
  })

  it('should make PUT request with correct URL, body and parameters', () => {
    const mockResponse = { success: true }
    const endpoint = '/test-endpoint'
    const body = { data: 'test' }
    const params = { api_token: 'test-token' }

    service.put(endpoint, body, params).subscribe(response => {
      expect(response).toEqual(mockResponse)
    })

    const req = httpMock.expectOne(
      req =>
        req.url === `https://api.themoviedb.org/3${endpoint}` &&
        req.params.get('api_token') === 'test-token'
    )

    expect(req.request.method).toBe('PUT')
    expect(req.request.body).toEqual(body)
    req.flush(mockResponse)
  })

  it('should make DELETE request with correct URL and parameters', () => {
    const mockResponse = { success: true }
    const endpoint = '/test-endpoint'
    const params = { api_token: 'test-token' }

    service.delete(endpoint, params).subscribe(response => {
      expect(response).toEqual(mockResponse)
    })

    const req = httpMock.expectOne(
      req =>
        req.url === `https://api.themoviedb.org/3${endpoint}` &&
        req.params.get('api_token') === 'test-token'
    )

    expect(req.request.method).toBe('DELETE')
    req.flush(mockResponse)
  })
})
