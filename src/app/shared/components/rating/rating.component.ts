import { Component, EventEmitter, Input, Output } from '@angular/core'
import { CommonModule } from '@angular/common'
import { MatSliderModule } from '@angular/material/slider'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'

@Component({
  selector: 'app-rating',
  standalone: true,
  imports: [CommonModule, MatSliderModule, MatButtonModule, MatIconModule],
  template: `
    <div *ngIf="!showValue; else simpleRating" class="rating-card">
      <div class="rating-header">{{ title }}</div>
      <div class="rating-content" *ngIf="!isSubmitted; else submittedTemplate">
        <mat-slider
          min="0"
          max="10"
          step="0.5"
          discrete
          [displayWith]="formatValue"
          class="rating-slider"
        >
          <input matSliderThumb [value]="value" (valueChange)="onValueChange($event)" />
        </mat-slider>
        <div class="rating-value dark-theme-compatible">{{ value }}</div>
        <button
          mat-flat-button
          color="accent"
          [disabled]="value <= 0 || isSubmitting"
          (click)="onSubmit()"
          class="submit-rating-button"
        >
          <mat-icon>star</mat-icon>
          {{ isSubmitting ? 'Submitting...' : submitText }}
        </button>
      </div>
      <ng-template #submittedTemplate>
        <div class="rating-success">
          <mat-icon color="accent">check_circle</mat-icon>
          <p>{{ successMessage }}</p>
          <p class="dark-theme-compatible">
            Your rating: <strong>{{ value }}</strong
            >/10
          </p>
        </div>
      </ng-template>
    </div>

    <ng-template #simpleRating>
      <div class="simple-rating">
        <mat-icon class="star-icon">star</mat-icon>
        <span class="dark-theme-compatible">{{ value | number: '1.1-1' }}</span>
      </div>
    </ng-template>
  `,
  styles: [
    `
      .rating-card {
        margin-top: 20px;
        background-color: var(--card-background, white);
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }

      .rating-header {
        padding: 12px;
        text-align: center;
        font-size: 1.1rem;
        font-weight: 500;
        color: var(--text-color, #333);
        border-bottom: 1px solid var(--divider-color, #eee);
      }

      .rating-content {
        padding: 16px;
        display: flex;
        flex-direction: column;
        align-items: center;
      }

      .rating-slider {
        width: 100%;
        margin-bottom: 12px;
      }

      .rating-value {
        font-size: 2rem;
        font-weight: bold;
        color: var(--accent-color, #ff4081);
        margin: 8px 0 16px;
      }

      .dark-theme-compatible {
        color: var(--accent-color, #ff4081) !important;
      }

      .submit-rating-button {
        width: 100%;
        background-color: var(--accent-color, #ff4081);
        color: white;
        padding: 8px;
      }

      .submit-rating-button mat-icon {
        margin-right: 8px;
      }

      .rating-success {
        padding: 16px;
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
      }

      .rating-success mat-icon {
        font-size: 32px;
        height: 32px;
        width: 32px;
        margin-bottom: 8px;
        color: var(--accent-color, #ff4081);
      }

      .rating-success p {
        margin: 4px 0;
        font-size: 0.9rem;
        color: var(--text-color, inherit);
      }

      .rating-success p strong {
        color: var(--accent-color, #ff4081);
        font-size: 1.1rem;
      }

      .simple-rating {
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .simple-rating .star-icon {
        color: #ffd700;
        margin-right: 4px;
      }

      .simple-rating span {
        font-weight: 600;
        font-size: 1rem;
      }
    `
  ]
})
export class RatingComponent {
  @Input() title = 'Rate this movie'
  @Input() value = 5
  @Input({ alias: 'rating' }) set ratingValue(val: number) {
    if (val !== undefined) {
      this.value = val
    }
  }
  @Input() showValue = false
  @Input() isSubmitting = false
  @Input() isSubmitted = false
  @Input() submitText = 'Submit Rating'
  @Input() successMessage = 'Thank you for rating this movie!'

  @Output() valueChange = new EventEmitter<number>()
  @Output() submit = new EventEmitter<void>()

  formatValue(value: number): string {
    return value.toString()
  }

  onValueChange(value: number): void {
    this.value = value
    this.valueChange.emit(value)
  }

  onSubmit(): void {
    this.submit.emit()
  }
}
