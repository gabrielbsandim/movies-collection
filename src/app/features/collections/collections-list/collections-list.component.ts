import { Component, OnInit, OnDestroy } from '@angular/core'
import { Router } from '@angular/router'
import { Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'
import { StorageService } from '@core/services/storage/storage.service'
import { ICollection } from '@core/models/collection/collection.model'
import { MatDialog } from '@angular/material/dialog'
import { MatSnackBar } from '@angular/material/snack-bar'
import { ConfirmDialogComponent } from '@shared/components/confirm-dialog/confirm-dialog.component'
import { CommonModule } from '@angular/common'
import { MatButtonModule } from '@angular/material/button'
import { MatCardModule } from '@angular/material/card'
import { MatIconModule } from '@angular/material/icon'
import { MatTooltipModule } from '@angular/material/tooltip'

@Component({
  selector: 'app-collections-list',
  templateUrl: './collections-list.component.html',
  styleUrls: ['./collections-list.component.scss'],
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatCardModule, MatIconModule, MatTooltipModule]
})
export class CollectionsListComponent implements OnInit, OnDestroy {
  collections: ICollection[] = []
  private destroy$ = new Subject<void>()

  constructor(
    private storageService: StorageService,
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.collections = this.storageService.getCollections()
    this.storageService.collections$.pipe(takeUntil(this.destroy$)).subscribe(collections => {
      this.collections = collections
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

  viewCollection(collectionId: string): void {
    this.router.navigate(['/collections', collectionId])
  }

  createCollection(): void {
    this.router.navigate(['/collections/create'])
  }

  deleteCollection(event: Event, collectionId: string): void {
    event.stopPropagation()

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Delete Collection',
        message: 'Are you sure you want to delete this collection? This action cannot be undone.',
        confirmText: 'Delete',
        cancelText: 'Cancel'
      }
    })

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const deleted = this.storageService.deleteCollection(collectionId)
        if (deleted) {
          this.snackBar.open('Collection deleted', 'Close', {
            duration: 3000
          })
        }
      }
    })
  }

  trackByCollectionId(index: number, collection: ICollection): string {
    return collection.id
  }
}
