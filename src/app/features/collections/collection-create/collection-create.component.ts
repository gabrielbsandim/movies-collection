import { Component } from '@angular/core'
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms'
import { Router } from '@angular/router'
import { StorageService } from '@core/services/storage/storage.service'
import { MatSnackBar } from '@angular/material/snack-bar'
import { CommonModule } from '@angular/common'
import { MatButtonModule } from '@angular/material/button'
import { MatCardModule } from '@angular/material/card'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { MatIconModule } from '@angular/material/icon'
import { AlphanumericOnlyDirective } from '@shared/directives/alphanumeric-only.directive'

@Component({
  selector: 'app-collection-create',
  templateUrl: './collection-create.component.html',
  styleUrls: ['./collection-create.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    AlphanumericOnlyDirective
  ]
})
export class CollectionCreateComponent {
  collectionForm: FormGroup

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private storageService: StorageService,
    private snackBar: MatSnackBar
  ) {
    this.collectionForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]]
    })
  }

  createCollection(): void {
    if (this.collectionForm.valid) {
      const { title, description } = this.collectionForm.value
      this.storageService.createCollection(title, description)

      this.snackBar.open('Collection created successfully!', 'Close', {
        duration: 3000
      })

      this.router.navigate(['/collections'])
    }
  }

  cancel(): void {
    this.router.navigate(['/collections'])
  }
}
