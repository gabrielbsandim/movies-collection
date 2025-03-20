import { TestBed } from '@angular/core/testing'
import { StorageService } from '@core/services/storage/storage.service'

describe('StorageService', () => {
  let service: StorageService

  beforeEach(() => {
    TestBed.configureTestingModule({})
    service = TestBed.inject(StorageService)

    localStorage.clear()
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })

  it('should create a collection', () => {
    const result = service.createCollection('Test Collection', 'Test description')

    expect(result.name).toBe('Test Collection')
    expect(result.description).toBe('Test description')
    expect(result.movies).toEqual([])
    expect(result.id).toBeTruthy()
  })

  it('should save and retrieve a session id', () => {
    service.saveSessionId('test-session')
    const sessionId = service.getSessionId()
    expect(sessionId).toBe('test-session')
  })
})
