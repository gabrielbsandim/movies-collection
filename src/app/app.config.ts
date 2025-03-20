import { ApplicationConfig, importProvidersFrom } from '@angular/core'
import { provideRouter } from '@angular/router'
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http'
import { provideAnimations } from '@angular/platform-browser/animations'

import { routes } from '@app/app.routes'
import { CoreModule } from '@app/core/core.module'

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()),
    provideAnimations(),
    importProvidersFrom(CoreModule)
  ]
}
