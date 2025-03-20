import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing'
import { ReactiveFormsModule } from '@angular/forms'
import { provideRouter } from '@angular/router'
import { MatSnackBarModule } from '@angular/material/snack-bar'
import { NoopAnimationsModule } from '@angular/platform-browser/animations'
import { of } from 'rxjs'
import { SearchComponent } from '@features/search/search.component'
import { MovieService } from '@core/services/movie/movie.service'
import { StorageService } from '@core/services/storage/storage.service'
import { SharedModule } from '@shared/shared.module'
import { IMovie, IMovies } from '@core/models/movie/movie.model'
import { ICollection } from '@core/models/collection/collection.model'

describe('SearchComponent', () => {
  let component: SearchComponent
  let fixture: ComponentFixture<SearchComponent>
  let movieServiceSpy: jasmine.SpyObj<MovieService>
  let storageServiceSpy: jasmine.SpyObj<StorageService>

  const mockMovie: IMovie = {
    id: 1,
    title: 'Test Movie',
    overview: 'Test overview',
    poster_path: '/path.jpg'
  }

  const mockMovies: IMovies = {
    results: [mockMovie],
    total_pages: 10,
    total_results: 100,
    page: 1
  }

  const mockCollection: ICollection = {
    id: '1',
    name: 'Test Collection',
    title: 'Test Collection',
    description: 'Test description',
    movies: [],
    createdAt: new Date(),
    updatedAt: new Date()
  }

  beforeEach(async () => {
    const movieSpy = jasmine.createSpyObj('MovieService', ['searchMovies', 'getPopularMovies'])

    const storageSpy = jasmine.createSpyObj(
      'StorageService',
      ['getCollections', 'addMoviesToCollection'],
      {
        collections$: of([mockCollection])
      }
    )

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        MatSnackBarModule,
        NoopAnimationsModule,
        SharedModule,
        SearchComponent
      ],
      providers: [
        provideRouter([]),
        { provide: MovieService, useValue: movieSpy },
        { provide: StorageService, useValue: storageSpy }
      ]
    }).compileComponents()

    movieServiceSpy = TestBed.inject(MovieService) as jasmine.SpyObj<MovieService>
    storageServiceSpy = TestBed.inject(StorageService) as jasmine.SpyObj<StorageService>

    movieServiceSpy.getPopularMovies.and.returnValue(of(mockMovies))
    storageServiceSpy.getCollections.and.returnValue([mockCollection])

    fixture = TestBed.createComponent(SearchComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should load popular movies on init', () => {
    expect(movieServiceSpy.getPopularMovies).toHaveBeenCalled()
    expect(component.movies).toEqual(mockMovies.results)
  })

  it('should load collections on init', () => {
    expect(storageServiceSpy.getCollections).toHaveBeenCalled()
    expect(component.collections).toEqual([mockCollection])
  })

  it('should search movies when query changes', fakeAsync(() => {
    movieServiceSpy.searchMovies.and.returnValue(of(mockMovies))

    component.searchForm.get('query')?.setValue('test')
    tick(500)

    expect(movieServiceSpy.searchMovies).toHaveBeenCalledWith('test', 1)
  }))
})
