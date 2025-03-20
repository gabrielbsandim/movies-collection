import { Injectable } from '@angular/core'
import { HttpClient, HttpParams } from '@angular/common/http'
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'https://api.themoviedb.org/3'

  constructor(private http: HttpClient) {}

  get<T>(endpoint: string, params: any = {}): Observable<T> {
    let httpParams = new HttpParams()

    Object.keys(params).forEach(key => {
      if (params[key] !== null && params[key] !== undefined) {
        httpParams = httpParams.set(key, params[key])
      }
    })

    return this.http.get<T>(`${this.apiUrl}${endpoint}`, { params: httpParams })
  }

  post<T>(endpoint: string, body: any, params: any = {}): Observable<T> {
    let httpParams = new HttpParams()

    Object.keys(params).forEach(key => {
      if (params[key] !== null && params[key] !== undefined) {
        httpParams = httpParams.set(key, params[key])
      }
    })

    return this.http.post<T>(`${this.apiUrl}${endpoint}`, body, { params: httpParams })
  }

  put<T>(endpoint: string, body: any, params: any = {}): Observable<T> {
    let httpParams = new HttpParams()

    Object.keys(params).forEach(key => {
      if (params[key] !== null && params[key] !== undefined) {
        httpParams = httpParams.set(key, params[key])
      }
    })

    return this.http.put<T>(`${this.apiUrl}${endpoint}`, body, { params: httpParams })
  }

  delete<T>(endpoint: string, params: any = {}): Observable<T> {
    let httpParams = new HttpParams()

    Object.keys(params).forEach(key => {
      if (params[key] !== null && params[key] !== undefined) {
        httpParams = httpParams.set(key, params[key])
      }
    })

    return this.http.delete<T>(`${this.apiUrl}${endpoint}`, { params: httpParams })
  }
}
