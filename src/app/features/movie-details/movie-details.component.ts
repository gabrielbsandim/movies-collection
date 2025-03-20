import { Component, OnInit, OnDestroy } from '@angular/core'
import { ActivatedRoute, Router, RouterModule } from '@angular/router'
import { Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'
import { MovieService } from '@core/services/movie/movie.service'
import { StorageService } from '@core/services/storage/storage.service'
import { IMovie } from '@core/models/movie/movie.model'
import { ICollection } from '@core/models/collection/collection.model'
import { MatSnackBar } from '@angular/material/snack-bar'
import { MatDialog, MatDialogModule } from '@angular/material/dialog'
import { routes } from '@core/models/common/constants.model'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { MatCardModule } from '@angular/material/card'
import { MatChipsModule } from '@angular/material/chips'
import { MatDividerModule } from '@angular/material/divider'
import { MatIconModule } from '@angular/material/icon'
import { MatMenuModule } from '@angular/material/menu'
import { MatProgressBarModule } from '@angular/material/progress-bar'
import { MatSliderModule } from '@angular/material/slider'
import { LoadingSpinnerComponent } from '@shared/components/loading-spinner/loading-spinner.component'
import { RatingComponent } from '@shared/components/rating/rating.component'

@Component({
  selector: 'app-movie-details',
  templateUrl: './movie-details.component.html',
  styleUrls: ['./movie-details.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatDividerModule,
    MatIconModule,
    MatMenuModule,
    MatProgressBarModule,
    MatSliderModule,
    MatDialogModule,
    LoadingSpinnerComponent,
    RatingComponent
  ]
})
export class MovieDetailsComponent implements OnInit, OnDestroy {
  movie: IMovie | null = null
  collections: ICollection[] = []
  loading = true
  private destroy$ = new Subject<void>()

  userRating = 5
  sessionId: string | null = null
  isRatingSubmitted = false
  isSubmittingRating = false

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private movieService: MovieService,
    private storageService: StorageService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    const movieId = Number(this.route.snapshot.paramMap.get('id'))

    if (movieId) {
      this.loadMovieDetails(movieId)
    } else {
      this.snackBar.open('Invalid movie ID', 'Close', {
        duration: 3000
      })
      this.router.navigate([routes['home']])
    }

    this.loadCollections()
    this.getOrCreateSessionId()
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

  private loadMovieDetails(movieId: number): void {
    this.loading = true
    this.movieService
      .getMovieDetails(movieId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: movie => {
          this.movie = this.prepareMovieData(movie)
          this.loading = false
        },
        error: error => {
          this.snackBar.open('Error loading movie details: ' + error.message, 'Close', {
            duration: 3000
          })
          this.loading = false
          this.router.navigate([routes['home']])
        }
      })
  }

  private prepareMovieData(movie: IMovie): IMovie {
    let overview = movie.overview
    if (!overview || overview.trim() === '') {
      overview = 'No synopsis available.'
    }

    return {
      ...movie,
      poster_path: movie.poster_path || '',
      overview: overview,
      release_date: movie.release_date || '',
      runtime: movie.runtime || 0,
      genres: movie.genres || [],
      production_companies: movie.production_companies || [],
      production_countries: movie.production_countries || [],
      spoken_languages: movie.spoken_languages || [],
      budget: movie.budget || 0,
      revenue: movie.revenue || 0,
      vote_average: movie.vote_average || 0,
      vote_count: movie.vote_count || 0
    }
  }

  private loadCollections(): void {
    this.collections = this.storageService.getCollections()
    this.storageService.collections$.pipe(takeUntil(this.destroy$)).subscribe(collections => {
      this.collections = collections
    })
  }

  private getOrCreateSessionId(): void {
    this.sessionId = this.storageService.getSessionId()

    const shouldCreateNew = !this.sessionId || this.isSessionExpired(this.sessionId)

    if (shouldCreateNew) {
      this.movieService
        .getSessionId()
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: sessionId => {
            this.sessionId = sessionId
            this.storageService.saveSessionId(sessionId)
          },
          error: _error => {
            this.snackBar.open('Could not initialize rating session', 'Close', {
              duration: 3000
            })
          }
        })
    }
  }

  private isSessionExpired(_sessionId: string): boolean {
    const sessionTimestamp = this.storageService.getSessionTimestamp()
    if (!sessionTimestamp) return true

    const now = new Date().getTime()
    const sessionTime = new Date(sessionTimestamp).getTime()
    const hoursPassed = (now - sessionTime) / (1000 * 60 * 60)

    return hoursPassed > 20
  }

  rateMovie(): void {
    if (!this.movie) {
      return
    }

    if (!this.sessionId) {
      this.snackBar.open('Preparing rating session. Please try again in a few seconds.', 'Close', {
        duration: 3000
      })
      return
    }

    if (this.isSubmittingRating) {
      return
    }

    this.isSubmittingRating = true

    this.movieService
      .rateMovie(this.movie.id, this.userRating, this.sessionId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: _response => {
          this.isRatingSubmitted = true
          this.isSubmittingRating = false
          this.snackBar.open('Rating submitted successfully!', 'Close', {
            duration: 3000
          })
        },
        error: _error => {
          this.isSubmittingRating = false

          if (_error.status === 401 || _error.message?.includes('authentication')) {
            this.sessionId = null
            this.storageService.saveSessionId('')
            this.snackBar.open('Session expired. Please try rating again.', 'Close', {
              duration: 3000
            })
          } else {
            this.snackBar.open('Movie not available for rating', 'Close', {
              duration: 3000
            })
          }
        }
      })
  }

  addToCollection(collectionId: string): void {
    if (!this.movie) return

    this.storageService.addMoviesToCollection(collectionId, [this.movie])
    this.snackBar.open('Movie added to collection', 'Close', {
      duration: 3000
    })
  }

  goBack(): void {
    this.router.navigate([routes['home']])
  }

  onRatingValueChange(value: number): void {
    this.userRating = value
  }
}
