import { ComponentFixture, TestBed } from '@angular/core/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { AppComponent } from '@app/app.component'
import { NO_ERRORS_SCHEMA } from '@angular/core'
import { ThemeService } from '@core/services/theme/theme.service'
import { of } from 'rxjs'
import { themes } from '@core/models/common/constants.model'

describe('AppComponent', () => {
  let component: AppComponent
  let fixture: ComponentFixture<AppComponent>
  let themeService: jasmine.SpyObj<ThemeService>

  beforeEach(async () => {
    const themeSpy = jasmine.createSpyObj('ThemeService', ['toggleTheme'], {
      theme$: of(themes['light'])
    })

    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, AppComponent],
      providers: [{ provide: ThemeService, useValue: themeSpy }],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents()

    themeService = TestBed.inject(ThemeService) as jasmine.SpyObj<ThemeService>
    fixture = TestBed.createComponent(AppComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create the app', () => {
    expect(component).toBeTruthy()
  })

  it('should toggle theme when toggleTheme is called', () => {
    component.toggleTheme()
    expect(themeService.toggleTheme).toHaveBeenCalled()
  })

  it(`should have as title 'movie-collections-app'`, () => {
    expect(component.title).toEqual('movie-collections-app')
  })

  it('should render title', () => {
    const compiled = fixture.nativeElement as HTMLElement
    expect(compiled.querySelector('h1')?.textContent).toContain('Movie Collections')
  })
})
