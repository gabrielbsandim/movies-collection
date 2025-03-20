import { ComponentFixture, TestBed } from '@angular/core/testing'
import { ActivatedRoute, Router, convertToParamMap, provideRouter } from '@angular/router'
import { MatDialogModule } from '@angular/material/dialog'
import { of, throwError } from 'rxjs'
import { MovieDetailsComponent } from '@features/movie-details/movie-details.component'
import { MovieService } from '@core/services/movie/movie.service'
import { StorageService } from '@core/services/storage/storage.service'
import { SharedModule } from '@shared/shared.module'
import { IMovie } from '@core/models/movie/movie.model'
import { ICollection } from '@core/models/collection/collection.model'
import { FormsModule } from '@angular/forms'
import { MatSnackBar } from '@angular/material/snack-bar'
import { MatDialog } from '@angular/material/dialog'
import { MovieCardComponent } from 'src/app/shared/components/movie-card/movie-card.component'
import { MatTabsModule } from '@angular/material/tabs'
import { MatListModule } from '@angular/material/list'
import { MatChipsModule } from '@angular/material/chips'
import { MatIconModule } from '@angular/material/icon'
import { MatButtonModule } from '@angular/material/button'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'

describe('MovieDetailsComponent', () => {
  let component: MovieDetailsComponent
  let fixture: ComponentFixture<MovieDetailsComponent>
  let movieServiceSpy: jasmine.SpyObj<MovieService>
  let storageServiceSpy: jasmine.SpyObj<StorageService>
  let routerSpy: jasmine.SpyObj<Router>
  let snackBarSpy: jasmine.SpyObj<MatSnackBar>

  const mockMovie: IMovie = {
    id: 1,
    title: 'Test Movie',
    overview: 'Test overview',
    poster_path: '/test-path.jpg',
    release_date: '2022-01-01',
    genres: [{ id: 1, name: 'Action' }],
    vote_average: 7.5,
    vote_count: 100
  }

  const mockCollections: ICollection[] = [
    {
      id: 'col1',
      name: 'Collection 1',
      title: 'Collection 1',
      description: 'Test collection 1',
      movies: [],
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]

  beforeEach(async () => {
    const movieService = jasmine.createSpyObj('MovieService', [
      'getMovieDetails',
      'getSessionId',
      'rateMovie'
    ])
    const storageService = jasmine.createSpyObj(
      'StorageService',
      [
        'getCollections',
        'getSessionId',
        'getSessionTimestamp',
        'saveSessionId',
        'addMoviesToCollection'
      ],
      {
        collections$: of(mockCollections)
      }
    )
    const router = jasmine.createSpyObj('Router', ['navigate'])
    const snackBar = jasmine.createSpyObj('MatSnackBar', ['open'])
    const dialogSpy = jasmine.createSpyObj('MatDialog', ['open'])

    await TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        SharedModule,
        FormsModule,
        MatTabsModule,
        MatListModule,
        MatDialogModule,
        MatChipsModule,
        MatIconModule,
        MatButtonModule,
        MovieDetailsComponent,
        MovieCardComponent
      ],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({ id: '1' })
            }
          }
        },
        { provide: MovieService, useValue: movieService },
        { provide: StorageService, useValue: storageService },
        { provide: Router, useValue: router },
        { provide: MatSnackBar, useValue: snackBar },
        { provide: MatDialog, useValue: dialogSpy }
      ]
    }).compileComponents()

    fixture = TestBed.createComponent(MovieDetailsComponent)
    component = fixture.componentInstance
    movieServiceSpy = TestBed.inject(MovieService) as jasmine.SpyObj<MovieService>
    storageServiceSpy = TestBed.inject(StorageService) as jasmine.SpyObj<StorageService>
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>
    snackBarSpy = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>

    movieServiceSpy.getMovieDetails.and.returnValue(of(mockMovie))
    storageServiceSpy.getCollections.and.returnValue(mockCollections)
    storageServiceSpy.getSessionId.and.returnValue('test-session-id')
    storageServiceSpy.getSessionTimestamp.and.returnValue(Date.now().toString())
  })

  it('should create', () => {
    fixture.detectChanges()
    expect(component).toBeTruthy()
  })

  it('should load movie details on init', () => {
    fixture.detectChanges()
    expect(movieServiceSpy.getMovieDetails).toHaveBeenCalledWith(1)
    expect(component.movie).toEqual(
      jasmine.objectContaining({
        id: 1,
        title: 'Test Movie'
      })
    )
    expect(component.loading).toBeFalse()
  })

  it('should load collections on init', () => {
    fixture.detectChanges()
    expect(storageServiceSpy.getCollections).toHaveBeenCalled()
    expect(component.collections).toEqual(mockCollections)
  })

  it('should handle error when loading movie details', () => {
    movieServiceSpy.getMovieDetails.and.returnValue(throwError(() => new Error('API Error')))
    fixture.detectChanges()
    expect(snackBarSpy.open).toHaveBeenCalledWith(
      jasmine.stringContaining('Error loading movie details'),
      'Close',
      jasmine.any(Object)
    )
    expect(routerSpy.navigate).toHaveBeenCalled()
  })

  it('should add movie to collection', () => {
    fixture.detectChanges()

    expect(component.movie).toBeTruthy()

    const collectionId = 'col1'
    component.addToCollection(collectionId)

    const expectedMovie = {
      id: 1,
      title: 'Test Movie',
      overview: 'Test overview',
      poster_path: '/test-path.jpg',
      release_date: '2022-01-01',
      genres: [{ id: 1, name: 'Action' }],
      vote_average: 7.5,
      vote_count: 100,
      runtime: 0,
      production_companies: [],
      production_countries: [],
      spoken_languages: [],
      budget: 0,
      revenue: 0
    }

    expect(storageServiceSpy.addMoviesToCollection).toHaveBeenCalledWith(collectionId, [
      expectedMovie
    ])
    expect(snackBarSpy.open).toHaveBeenCalledWith(
      'Movie added to collection',
      'Close',
      jasmine.any(Object)
    )
  })

  it('should rate a movie successfully', () => {
    movieServiceSpy.rateMovie.and.returnValue(of({ success: true }))
    fixture.detectChanges()
    component.rateMovie()
    expect(movieServiceSpy.rateMovie).toHaveBeenCalledWith(1, 5, 'test-session-id')
    expect(component.isRatingSubmitted).toBeTrue()
    expect(component.isSubmittingRating).toBeFalse()
    expect(snackBarSpy.open).toHaveBeenCalledWith(
      'Rating submitted successfully!',
      'Close',
      jasmine.any(Object)
    )
  })

  it('should handle expired session when rating', () => {
    const error = { status: 401, message: 'Session expired or authentication failed' }
    movieServiceSpy.rateMovie.and.returnValue(throwError(() => error))

    fixture.detectChanges()
    component.sessionId = 'test-session-id'
    component.rateMovie()

    expect(component.isSubmittingRating).toBeFalse()
    expect(snackBarSpy.open).toHaveBeenCalledWith(
      'Session expired. Please try rating again.',
      'Close',
      jasmine.any(Object)
    )
  })

  it('should update rating value when slider changes', () => {
    fixture.detectChanges()
    component.onRatingValueChange(8)
    expect(component.userRating).toBe(8)
  })

  it('should navigate back when goBack is called', () => {
    fixture.detectChanges()
    component.goBack()
    expect(routerSpy.navigate).toHaveBeenCalled()
  })
})
