import { Injectable } from '@angular/core'
import { StorageService } from '@core/services/storage/storage.service'
import { TTheme, themes } from '@core/models/common/constants.model'
import { Observable } from 'rxjs'
import { take } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private currentTheme: TTheme = themes['light']

  constructor(private storageService: StorageService) {
    this.storageService.theme$.pipe(take(1)).subscribe(theme => {
      this.currentTheme = theme
      this.applyTheme(theme)
    })

    this.storageService.theme$.subscribe(theme => {
      this.currentTheme = theme
      this.applyTheme(theme)
    })
  }

  get theme$(): Observable<TTheme> {
    return this.storageService.theme$
  }

  toggleTheme(): void {
    const newTheme = this.currentTheme === themes['light'] ? themes['dark'] : themes['light']
    this.storageService.setTheme(newTheme)
  }

  private applyTheme(theme: TTheme): void {
    document.body.classList.remove(themes['light'], themes['dark'])
    document.body.classList.add(theme)
  }
}
