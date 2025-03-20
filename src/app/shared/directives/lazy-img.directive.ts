import { Directive, ElementRef, HostBinding, Input, OnInit } from '@angular/core'

@Directive({
  selector: 'img[appLazyImg]',
  standalone: true
})
export class LazyImgDirective implements OnInit {
  @HostBinding('attr.loading') loading = 'lazy'

  @Input() fallbackSrc = 'assets/images/no-poster.svg'

  constructor(private el: ElementRef) {}

  ngOnInit(): void {
    const img = this.el.nativeElement as HTMLImageElement

    img.addEventListener('error', () => {
      console.error('Error loading image')
      img.setAttribute('src', this.fallbackSrc)
    })
  }
}
