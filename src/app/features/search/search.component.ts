import { Component, OnInit, OnDestroy } from '@angular/core'
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { Subject } from 'rxjs'
import { debounceTime, distinctUntilChanged, switchMap, takeUntil } from 'rxjs/operators'
import { MovieService } from '@core/services/movie/movie.service'
import { StorageService } from '@core/services/storage/storage.service'
import { IMovie } from '@core/models/movie/movie.model'
import { ICollection } from '@core/models/collection/collection.model'
import { MatSnackBar } from '@angular/material/snack-bar'
import { CommonModule } from '@angular/common'
import { MatButtonModule } from '@angular/material/button'
import { MatCardModule } from '@angular/material/card'
import { MatChipsModule } from '@angular/material/chips'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatIconModule } from '@angular/material/icon'
import { MatInputModule } from '@angular/material/input'
import { MatPaginatorModule } from '@angular/material/paginator'
import { MatSelectModule } from '@angular/material/select'
import { MatSliderModule } from '@angular/material/slider'
import { MatMenuModule } from '@angular/material/menu'
import { MovieCardComponent } from '@shared/components/movie-card/movie-card.component'
import { AlphanumericOnlyDirective } from '@shared/directives/alphanumeric-only.directive'
import { LoadingSpinnerComponent } from '@shared/components/loading-spinner/loading-spinner.component'
import { InfiniteScrollDirective } from 'ngx-infinite-scroll'

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatPaginatorModule,
    MatSelectModule,
    MatSliderModule,
    MatMenuModule,
    MovieCardComponent,
    AlphanumericOnlyDirective,
    LoadingSpinnerComponent,
    InfiniteScrollDirective
  ]
})
export class SearchComponent implements OnInit, OnDestroy {
  searchForm!: FormGroup
  movies: IMovie[] = []
  totalPages = 0
  currentPage = 1
  loading = false
  loadingMore = false
  selectedMovies: Set<number> = new Set()
  collections: ICollection[] = []
  hasMoreMovies = true

  private destroy$ = new Subject<void>()
  private searchQuery = ''

  constructor(
    private fb: FormBuilder,
    private movieService: MovieService,
    private storageService: StorageService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.initForm()
    this.loadCollections()
    this.loadPopularMovies()
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

  private initForm(): void {
    this.searchForm = this.fb.group({
      query: ['', [Validators.minLength(3), Validators.pattern(/^[a-zA-Z0-9\s]+$/)]]
    })

    this.searchForm
      .get('query')
      ?.valueChanges.pipe(
        takeUntil(this.destroy$),
        debounceTime(500),
        distinctUntilChanged(),
        switchMap(query => {
          this.searchQuery = query && query.length >= 3 ? query : ''
          this.currentPage = 1
          this.movies = []
          this.hasMoreMovies = true

          if (this.searchQuery) {
            this.loading = true
            return this.movieService.searchMovies(this.searchQuery, 1)
          }
          return this.movieService.getPopularMovies(1)
        })
      )
      .subscribe({
        next: response => {
          this.movies = response.results
          this.totalPages = response.total_pages
          this.hasMoreMovies = this.currentPage < this.totalPages
          this.loading = false
        },
        error: error => {
          this.snackBar.open('Error searching movies: ' + error.message, 'Close', {
            duration: 3000
          })
          this.loading = false
        }
      })
  }

  private loadCollections(): void {
    this.collections = this.storageService.getCollections()
    this.storageService.collections$.pipe(takeUntil(this.destroy$)).subscribe(collections => {
      this.collections = collections
    })
  }

  private loadPopularMovies(): void {
    this.loading = true
    this.movieService
      .getPopularMovies()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: response => {
          this.movies = response.results
          this.totalPages = response.total_pages
          this.hasMoreMovies = this.currentPage < this.totalPages
          this.loading = false
        },
        error: error => {
          this.snackBar.open('Error loading popular movies: ' + error.message, 'Close', {
            duration: 3000
          })
          this.loading = false
        }
      })
  }

  onScrollDown(): void {
    if (this.hasMoreMovies && !this.loading && !this.loadingMore) {
      this.loadMoreMovies()
    }
  }

  loadMoreMovies(): void {
    if (this.currentPage >= this.totalPages) {
      this.hasMoreMovies = false
      return
    }

    this.loadingMore = true
    const nextPage = this.currentPage + 1

    const request$ = this.searchQuery
      ? this.movieService.searchMovies(this.searchQuery, nextPage)
      : this.movieService.getPopularMovies(nextPage)

    request$.pipe(takeUntil(this.destroy$)).subscribe({
      next: response => {
        this.movies = [...this.movies, ...response.results]
        this.currentPage = nextPage
        this.hasMoreMovies = this.currentPage < this.totalPages
        this.loadingMore = false
      },
      error: error => {
        this.snackBar.open('Error loading more movies: ' + error.message, 'Close', {
          duration: 3000
        })
        this.loadingMore = false
      }
    })
  }

  viewMovieDetails(movieId: number): void {
    this.router.navigate(['movie', movieId])
  }

  toggleMovieSelection(movieId: number): void {
    if (this.selectedMovies.has(movieId)) {
      this.selectedMovies.delete(movieId)
    } else {
      this.selectedMovies.add(movieId)
    }
  }

  addToCollection(collectionId: string): void {
    if (this.selectedMovies.size === 0) return

    const selectedMovies = this.movies.filter(movie => this.selectedMovies.has(movie.id))
    this.storageService.addMoviesToCollection(collectionId, selectedMovies)

    this.snackBar.open(
      `Added ${this.selectedMovies.size} ${
        this.selectedMovies.size === 1 ? 'movie' : 'movies'
      } to collection`,
      'Close',
      {
        duration: 3000
      }
    )

    this.selectedMovies.clear()
  }

  createNewCollection(): void {
    this.router.navigate(['/collections/create'])
  }

  trackByMovieId(index: number, movie: IMovie): number {
    return movie.id
  }
}
