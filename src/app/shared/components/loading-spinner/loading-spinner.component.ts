import { Component } from '@angular/core'
import { CommonModule } from '@angular/common'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule],
  template: `
    <div class="spinner-container">
      <mat-spinner diameter="40"></mat-spinner>
    </div>
  `,
  styles: [
    `
      .spinner-container {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 20px;
      }
    `
  ]
})
export class LoadingSpinnerComponent {}
