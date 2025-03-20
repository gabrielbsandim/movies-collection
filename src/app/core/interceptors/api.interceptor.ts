import { Injectable } from '@angular/core'
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http'
import { Observable, throwError } from 'rxjs'
import { catchError, retry } from 'rxjs/operators'
import { environment } from '@env/environment'
import { MatSnackBar } from '@angular/material/snack-bar'

@Injectable()
export class ApiInterceptor implements HttpInterceptor {
  constructor(private snackBar: MatSnackBar) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (request.url.includes('api.themoviedb.org')) {
      const apiReq = request.clone({
        params: request.params.set('api_key', this.getApiKey())
      })

      return next.handle(apiReq).pipe(
        retry(2),
        catchError((error: HttpErrorResponse) => {
          let errorMsg = ''

          if (error.error instanceof ErrorEvent) {
            errorMsg = `Error: ${error.error.message}`
          } else {
            errorMsg = `Code: ${error.status}, Message: ${error.message}`
          }

          this.snackBar.open(errorMsg, 'Close', {
            duration: 5000,
            panelClass: ['error-snackbar']
          })

          return throwError(() => new Error(errorMsg))
        })
      )
    }

    return next.handle(request)
  }

  protected getApiKey(): string {
    return environment.apiKey
  }
}
