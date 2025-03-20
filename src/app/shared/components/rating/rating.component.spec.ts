import { ComponentFixture, TestBed } from '@angular/core/testing'
import { RatingComponent } from './rating.component'
import { NoopAnimationsModule } from '@angular/platform-browser/animations'
import { By } from '@angular/platform-browser'
import { Component } from '@angular/core'

@Component({
  template: `
    <app-rating
      [value]="testValue"
      [isSubmitting]="isSubmitting"
      [isSubmitted]="isSubmitted"
      (valueChange)="onValueChange($event)"
      (submit)="onSubmit()"
    ></app-rating>
  `,
  standalone: true,
  imports: [RatingComponent]
})
class TestHostComponent {
  testValue = 5
  isSubmitting = false
  isSubmitted = false
  submittedValue = 0
  submitCalled = false

  onValueChange(value: number): void {
    this.submittedValue = value
  }

  onSubmit(): void {
    this.submitCalled = true
  }
}

describe('RatingComponent', () => {
  let hostComponent: TestHostComponent
  let hostFixture: ComponentFixture<TestHostComponent>
  let ratingComponent: RatingComponent

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, RatingComponent, TestHostComponent]
    }).compileComponents()

    hostFixture = TestBed.createComponent(TestHostComponent)
    hostComponent = hostFixture.componentInstance

    const ratingDebugElement = hostFixture.debugElement.query(By.directive(RatingComponent))
    ratingComponent = ratingDebugElement.componentInstance

    hostFixture.detectChanges()
  })

  it('should create', () => {
    expect(hostComponent).toBeTruthy()
    expect(ratingComponent).toBeTruthy()
  })

  it('should display the initial rating value', () => {
    const valueEl = hostFixture.nativeElement.querySelector('.rating-value')
    expect(valueEl.textContent.trim()).toBe('5')
  })

  it('should emit valueChange when slider value changes', () => {
    spyOn(hostComponent, 'onValueChange')
    ratingComponent.onValueChange(7)
    expect(hostComponent.onValueChange).toHaveBeenCalledWith(7)
  })

  it('should emit submit event when submit button is clicked', () => {
    spyOn(hostComponent, 'onSubmit')
    const submitButton = hostFixture.nativeElement.querySelector('.submit-rating-button')
    submitButton.click()
    expect(hostComponent.onSubmit).toHaveBeenCalled()
  })

  it('should disable submit button when value is 0', () => {
    hostComponent.testValue = 0
    ratingComponent.value = 0
    hostFixture.detectChanges()
    const submitButton = hostFixture.nativeElement.querySelector('.submit-rating-button')
    expect(submitButton.disabled).toBe(true)
  })

  it('should disable submit button when isSubmitting is true', () => {
    hostComponent.isSubmitting = true
    ratingComponent.isSubmitting = true
    hostFixture.detectChanges()
    const submitButton = hostFixture.nativeElement.querySelector('.submit-rating-button')
    expect(submitButton.disabled).toBe(true)
  })

  it('should show success message when isSubmitted is true', () => {
    hostComponent.isSubmitted = true
    ratingComponent.isSubmitted = true
    hostFixture.detectChanges()
    const successMsg = hostFixture.nativeElement.querySelector('.rating-success')
    expect(successMsg).toBeTruthy()
    expect(successMsg.textContent).toContain('Thank you for rating this movie')
  })
})
