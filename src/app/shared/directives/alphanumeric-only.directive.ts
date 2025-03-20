import { Directive, HostListener } from '@angular/core'

@Directive({
  selector: '[appAlphanumericOnly]',
  standalone: true
})
export class AlphanumericOnlyDirective {
  @HostListener('keypress', ['$event'])
  onKeyPress(event: KeyboardEvent): boolean {
    const regex = /[a-zA-Z0-9\s]/
    const key = String.fromCharCode(event.charCode)

    if (!regex.test(key)) {
      event.preventDefault()
      return false
    }
    return true
  }
}
