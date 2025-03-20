import { Component, OnInit, OnDestroy } from '@angular/core'
import { ActivatedRoute, Router, RouterModule } from '@angular/router'
import { Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'
import { StorageService } from '@core/services/storage/storage.service'
import { ICollection } from '@core/models/collection/collection.model'
import { IMovie } from '@core/models/movie/movie.model'
import { MatDialog, MatDialogModule } from '@angular/material/dialog'
import { MatSnackBar } from '@angular/material/snack-bar'
import { routes } from '@core/models/common/constants.model'
import { ConfirmDialogComponent } from '@shared/components/confirm-dialog/confirm-dialog.component'
import { CommonModule } from '@angular/common'
import { MatButtonModule } from '@angular/material/button'
import { MatCardModule } from '@angular/material/card'
import { MatIconModule } from '@angular/material/icon'
import { MatDividerModule } from '@angular/material/divider'
import { MovieCardComponent } from '@shared/components/movie-card/movie-card.component'
import { CollectionEditDialogComponent } from '@features/collections/collection-edit-dialog/collection-edit-dialog.component'

@Component({
  selector: 'app-collection-detail',
  templateUrl: './collection-detail.component.html',
  styleUrls: ['./collection-detail.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatDividerModule,
    MatDialogModule,
    MovieCardComponent
  ]
})
export class CollectionDetailComponent implements OnInit, OnDestroy {
  collection: ICollection | null = null
  private destroy$ = new Subject<void>()

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private storageService: StorageService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    const collectionId = this.route.snapshot.paramMap.get('id')
    if (collectionId) {
      this.loadCollection(collectionId)
    }

    this.storageService.collections$.pipe(takeUntil(this.destroy$)).subscribe(() => {
      if (collectionId) {
        this.loadCollection(collectionId)
      }
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

  private loadCollection(collectionId: string): void {
    const collection = this.storageService.getCollection(collectionId)
    if (collection) {
      this.collection = collection
    } else {
      this.snackBar.open('Collection not found', 'Close', {
        duration: 3000
      })
      this.router.navigate([routes['collections']])
    }
  }

  removeMovie(movieId: number): void {
    if (!this.collection) return

    this.storageService.removeMovieFromCollection(this.collection.id, movieId)
    this.snackBar.open('Movie removed from collection', 'Close', {
      duration: 3000
    })

    this.collection = this.storageService.getCollection(this.collection.id) || null
  }

  removeAllMovies(): void {
    if (!this.collection || this.collection.movies.length === 0) return

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Remove All Movies',
        message: 'Are you sure you want to remove all movies from this collection?',
        confirmText: 'Remove All',
        cancelText: 'Cancel'
      }
    })

    dialogRef.afterClosed().subscribe(result => {
      if (result && this.collection) {
        this.storageService.removeAllMoviesFromCollection(this.collection.id)
        this.snackBar.open('All movies removed from collection', 'Close', {
          duration: 3000
        })
        this.collection = this.storageService.getCollection(this.collection.id) || null
      }
    })
  }

  deleteCollection(): void {
    if (!this.collection) return

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Delete Collection',
        message: 'Are you sure you want to delete this collection? This action cannot be undone.',
        confirmText: 'Delete',
        cancelText: 'Cancel'
      }
    })

    dialogRef.afterClosed().subscribe(result => {
      if (result && this.collection) {
        this.storageService.deleteCollection(this.collection.id)
        this.snackBar.open('Collection deleted', 'Close', {
          duration: 3000
        })
        this.router.navigate([routes['collections']])
      }
    })
  }

  viewMovieDetails(movieId: number): void {
    this.router.navigate([routes['movieDetails'], movieId])
  }

  goBack(): void {
    this.router.navigate([routes['collections']])
  }

  trackByMovieId(index: number, movie: IMovie): number {
    return movie.id
  }

  getLastUpdated(): Date {
    return new Date()
  }

  editCollection(): void {
    if (!this.collection) return

    const dialogRef = this.dialog.open(CollectionEditDialogComponent, {
      width: '500px',
      data: { collection: this.collection }
    })

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const updatedCollection = this.storageService.updateCollection(this.collection!.id, result)
        if (updatedCollection) {
          this.collection = updatedCollection
          this.snackBar.open('Collection updated successfully!', 'Close', {
            duration: 3000
          })
        }
      }
    })
  }
}
