import { Component, DebugElement } from '@angular/core'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { By } from '@angular/platform-browser'
import { AlphanumericOnlyDirective } from '@shared/directives/alphanumeric-only.directive'

@Component({
  template: `<input appAlphanumericOnly />`,
  standalone: true,
  imports: [AlphanumericOnlyDirective]
})
class TestComponent {}

describe('AlphanumericOnlyDirective', () => {
  let fixture: ComponentFixture<TestComponent>
  let inputEl: DebugElement

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestComponent]
    })

    fixture = TestBed.createComponent(TestComponent)
    inputEl = fixture.debugElement.query(By.css('input'))
    fixture.detectChanges()
  })

  it('should create an instance', () => {
    const directive = new AlphanumericOnlyDirective()
    expect(directive).toBeTruthy()
  })

  it('should allow alphanumeric characters', () => {
    const event = new KeyboardEvent('keypress', {
      key: 'a',
      charCode: 'a'.charCodeAt(0)
    })

    spyOn(event, 'preventDefault')
    inputEl.nativeElement.dispatchEvent(event)

    expect(event.preventDefault).not.toHaveBeenCalled()
  })

  it('should allow numbers', () => {
    const event = new KeyboardEvent('keypress', {
      key: '5',
      charCode: '5'.charCodeAt(0)
    })

    spyOn(event, 'preventDefault')
    inputEl.nativeElement.dispatchEvent(event)

    expect(event.preventDefault).not.toHaveBeenCalled()
  })

  it('should allow spaces', () => {
    const event = new KeyboardEvent('keypress', {
      key: ' ',
      charCode: ' '.charCodeAt(0)
    })

    spyOn(event, 'preventDefault')
    inputEl.nativeElement.dispatchEvent(event)

    expect(event.preventDefault).not.toHaveBeenCalled()
  })

  it('should prevent special characters', () => {
    const event = new KeyboardEvent('keypress', {
      key: '!',
      charCode: '!'.charCodeAt(0)
    })

    spyOn(event, 'preventDefault')
    inputEl.nativeElement.dispatchEvent(event)

    expect(event.preventDefault).toHaveBeenCalled()
  })
})
