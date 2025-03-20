import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core'
import { IMovie } from '@core/models/movie/movie.model'
import { CommonModule } from '@angular/common'
import { MatButtonModule } from '@angular/material/button'
import { MatCardModule } from '@angular/material/card'
import { MatIconModule } from '@angular/material/icon'
import { MatChipsModule } from '@angular/material/chips'
import { MatTooltipModule } from '@angular/material/tooltip'
import { RatingComponent } from '@shared/components/rating/rating.component'
import { LazyImgDirective } from '@shared/directives/lazy-img.directive'

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatChipsModule,
    MatTooltipModule,
    RatingComponent,
    LazyImgDirective
  ]
})
export class MovieCardComponent {
  @Input() movie!: IMovie
  @Input() selectable = false
  @Input() selected = false
  @Input() showRating = true

  @Output() select = new EventEmitter<number>()
  @Output() view = new EventEmitter<number>()
  @Output() remove = new EventEmitter<number>()

  posterUrl(path: string | undefined): string {
    if (!path) {
      return 'assets/images/no-poster.svg'
    }

    if (path.startsWith('http')) {
      return path
    }

    return `https://image.tmdb.org/t/p/w500${path}`
  }

  onSelect(): void {
    this.select.emit(this.movie.id)
  }

  onView(event: Event): void {
    event.stopPropagation()
    this.view.emit(this.movie.id)
  }

  onRemove(event: Event): void {
    event.stopPropagation()
    this.remove.emit(this.movie.id)
  }
}
