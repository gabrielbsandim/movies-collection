import { Component, Inject } from '@angular/core'
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms'
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog'
import { ICollection } from '@core/models/collection/collection.model'
import { CommonModule } from '@angular/common'
import { MatButtonModule } from '@angular/material/button'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { MatIconModule } from '@angular/material/icon'
import { AlphanumericOnlyDirective } from '@shared/directives/alphanumeric-only.directive'

@Component({
  selector: 'app-collection-edit-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    AlphanumericOnlyDirective
  ],
  template: `
    <h2 mat-dialog-title>Edit Collection</h2>
    <div mat-dialog-content>
      <form [formGroup]="editForm">
        <div class="field-label">Title*</div>
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Title</mat-label>
          <mat-icon matPrefix class="field-icon">title</mat-icon>
          <input
            matInput
            formControlName="title"
            placeholder="Enter collection title"
            appAlphanumericOnly
            class="custom-input"
          />
          <mat-error *ngIf="editForm.get('title')?.hasError('required')">
            Title is required
          </mat-error>
          <mat-error *ngIf="editForm.get('title')?.hasError('minlength')">
            Title must be at least 3 characters
          </mat-error>
        </mat-form-field>

        <div class="field-label">Description*</div>
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Description</mat-label>
          <mat-icon matPrefix class="field-icon">description</mat-icon>
          <textarea
            matInput
            formControlName="description"
            placeholder="Enter collection description"
            rows="4"
            class="custom-textarea"
          >
          </textarea>
          <mat-error *ngIf="editForm.get('description')?.hasError('required')">
            Description is required
          </mat-error>
          <mat-error *ngIf="editForm.get('description')?.hasError('minlength')">
            Description must be at least 10 characters
          </mat-error>
        </mat-form-field>
      </form>
    </div>
    <div mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancel</button>
      <button mat-raised-button color="primary" [disabled]="editForm.invalid" (click)="onSave()">
        Save Changes
      </button>
    </div>
  `,
  styles: [
    `
      .full-width {
        width: 100%;
        margin-bottom: 16px;
      }

      textarea {
        min-height: 80px;
      }

      .field-label {
        font-weight: 500;
        margin-bottom: 8px;
        color: #333;
        font-size: 14px;
      }

      .field-icon {
        color: #555;
      }

      .custom-input,
      .custom-textarea {
        color: #333;
      }

      :host-context(.dark-theme) {
        .field-label {
          color: #ffffff;
          opacity: 0.9;
        }

        .field-icon {
          color: rgba(255, 255, 255, 0.7);
        }

        .custom-input,
        .custom-textarea {
          color: white !important;
        }

        ::ng-deep .mat-mdc-form-field-outline {
          color: rgba(255, 255, 255, 0.6);
        }

        ::ng-deep .mat-mdc-text-field-wrapper {
          background-color: #2d2d2d;
        }

        ::ng-deep .mat-mdc-form-field.mat-focused .mat-mdc-form-field-outline {
          color: var(--primary-light);
        }

        ::ng-deep input,
        ::ng-deep textarea {
          color: white !important;
          caret-color: white;
        }

        ::ng-deep .mat-mdc-form-field-infix {
          color: white;
        }

        ::ng-deep .mat-mdc-icon {
          color: rgba(255, 255, 255, 0.7);
        }
      }

      ::ng-deep .mat-mdc-form-field .mat-mdc-form-field-label {
        color: rgba(0, 0, 0, 0.8) !important;
        font-weight: 500 !important;
      }

      ::ng-deep .dark-theme .mat-mdc-form-field .mat-mdc-form-field-label {
        color: rgba(255, 255, 255, 0.8) !important;
      }
    `
  ]
})
export class CollectionEditDialogComponent {
  editForm: FormGroup

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<CollectionEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { collection: ICollection }
  ) {
    this.editForm = this.fb.group({
      title: [data.collection.title, [Validators.required, Validators.minLength(3)]],
      description: [data.collection.description, [Validators.required, Validators.minLength(10)]]
    })
  }

  onCancel(): void {
    this.dialogRef.close()
  }

  onSave(): void {
    if (this.editForm.valid) {
      this.dialogRef.close(this.editForm.value)
    }
  }
}
