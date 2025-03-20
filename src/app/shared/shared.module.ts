import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { RouterModule } from '@angular/router'
import { MaterialModule } from '@shared/material.module'
import { AlphanumericOnlyDirective } from '@shared/directives/alphanumeric-only.directive'
import { ConfirmDialogComponent } from '@shared/components/confirm-dialog/confirm-dialog.component'
import { MovieCardComponent } from '@shared/components/movie-card/movie-card.component'
import { RatingComponent } from '@shared/components/rating/rating.component'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    MaterialModule,
    AlphanumericOnlyDirective,
    ConfirmDialogComponent,
    MovieCardComponent,
    RatingComponent
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    MaterialModule,
    AlphanumericOnlyDirective,
    ConfirmDialogComponent,
    MovieCardComponent,
    RatingComponent
  ]
})
export class SharedModule {}
