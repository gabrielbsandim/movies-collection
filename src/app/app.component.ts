import { Component, OnInit } from '@angular/core'
import { Router, RouterOutlet } from '@angular/router'
import { CommonModule } from '@angular/common'
import { SharedModule } from '@shared/shared.module'
import { ThemeService } from '@core/services/theme/theme.service'
import { TTheme, themes, routes } from '@core/models/common/constants.model'
import { MatIconModule } from '@angular/material/icon'
import { MatButtonModule } from '@angular/material/button'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, SharedModule, MatIconModule, MatButtonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'movie-collections-app'
  currentTheme: TTheme = themes['light']

  constructor(
    private themeService: ThemeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.themeService.theme$.subscribe(theme => {
      this.currentTheme = theme
    })
  }

  toggleTheme(): void {
    this.themeService.toggleTheme()
  }

  navigateToHome(): void {
    this.router.navigate(['/'])
  }

  navigateToCollections(): void {
    this.router.navigate(['/' + routes['collections']])
  }

  get isDarkTheme(): boolean {
    return this.currentTheme === themes['dark']
  }
}
