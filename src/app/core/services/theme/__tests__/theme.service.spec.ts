import { TestBed } from '@angular/core/testing'
import { ThemeService } from '@core/services/theme/theme.service'
import { TTheme, themes } from '@core/models/common/constants.model'
import { StorageService } from '@core/services/storage/storage.service'
import { BehaviorSubject } from 'rxjs'

describe('ThemeService', () => {
  let service: ThemeService
  let storageServiceSpy: jasmine.SpyObj<StorageService>
  let themeSubject: BehaviorSubject<TTheme>

  beforeEach(() => {
    themeSubject = new BehaviorSubject<TTheme>(themes['light'])

    const spy = jasmine.createSpyObj('StorageService', ['setTheme'], {
      theme$: themeSubject.asObservable()
    })

    TestBed.configureTestingModule({
      providers: [ThemeService, { provide: StorageService, useValue: spy }]
    })

    service = TestBed.inject(ThemeService)
    storageServiceSpy = TestBed.inject(StorageService) as jasmine.SpyObj<StorageService>
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })

  it('should apply theme on initialization', () => {
    spyOn(document.body.classList, 'add')
    spyOn(document.body.classList, 'remove')

    new ThemeService(storageServiceSpy)

    expect(document.body.classList.remove).toHaveBeenCalledWith(themes['light'], themes['dark'])
    expect(document.body.classList.add).toHaveBeenCalledWith(themes['light'])
  })

  it('should toggle theme from light to dark', () => {
    themeSubject.next(themes['light'])
    storageServiceSpy.setTheme.and.callFake((theme: TTheme) => {
      themeSubject.next(theme)
    })

    spyOn(document.body.classList, 'add')
    spyOn(document.body.classList, 'remove')

    service.toggleTheme()

    expect(storageServiceSpy.setTheme).toHaveBeenCalledWith(themes['dark'])
    expect(document.body.classList.remove).toHaveBeenCalledWith(themes['light'], themes['dark'])
    expect(document.body.classList.add).toHaveBeenCalledWith(themes['dark'])
  })

  it('should toggle theme from dark to light', () => {
    themeSubject.next(themes['dark'])
    storageServiceSpy.setTheme.and.callFake((theme: TTheme) => {
      themeSubject.next(theme)
    })

    spyOn(document.body.classList, 'add')
    spyOn(document.body.classList, 'remove')

    service.toggleTheme()

    expect(storageServiceSpy.setTheme).toHaveBeenCalledWith(themes['light'])
    expect(document.body.classList.remove).toHaveBeenCalledWith(themes['light'], themes['dark'])
    expect(document.body.classList.add).toHaveBeenCalledWith(themes['light'])
  })
})
