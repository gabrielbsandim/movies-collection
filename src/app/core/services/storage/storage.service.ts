import { Injectable } from '@angular/core'
import { BehaviorSubject } from 'rxjs'
import { ICollection } from '@core/models/collection/collection.model'
import { IMovie } from '@core/models/movie/movie.model'
import {
  storageKeys,
  TTheme,
  themes,
  TLanguage,
  languages
} from '@core/models/common/constants.model'

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private collectionsSubject = new BehaviorSubject<ICollection[]>([])
  private themeSubject = new BehaviorSubject<TTheme>(themes['light'])
  private languageSubject = new BehaviorSubject<TLanguage>(languages['en'])

  collections$ = this.collectionsSubject.asObservable()
  theme$ = this.themeSubject.asObservable()
  language$ = this.languageSubject.asObservable()

  constructor() {
    this.loadCollections()
    this.loadTheme()
    this.loadLanguage()
  }

  private loadCollections(): void {
    try {
      const storedCollections = localStorage.getItem(storageKeys['collections'])
      if (storedCollections) {
        const collections: ICollection[] = JSON.parse(storedCollections)
        collections.forEach(collection => {
          collection.createdAt = new Date(collection.createdAt)
          if (collection.updatedAt) {
            collection.updatedAt = new Date(collection.updatedAt)
          }
        })
        this.collectionsSubject.next(collections)
      }
    } catch (error) {
      console.error('Error loading collections from localStorage:', error)
      this.collectionsSubject.next([])
    }
  }

  private loadTheme(): void {
    try {
      const storedTheme = localStorage.getItem(storageKeys['theme']) as TTheme
      if (storedTheme && Object.values(themes).includes(storedTheme)) {
        this.themeSubject.next(storedTheme)
      }
    } catch (error) {
      console.error('Error loading theme from localStorage:', error)
    }
  }

  private loadLanguage(): void {
    try {
      const storedLanguage = localStorage.getItem(storageKeys['language']) as TLanguage
      if (storedLanguage && Object.values(languages).includes(storedLanguage)) {
        this.languageSubject.next(storedLanguage)
      }
    } catch (error) {
      console.error('Error loading language from localStorage:', error)
    }
  }

  private saveCollections(collections: ICollection[]): void {
    try {
      localStorage.setItem(storageKeys['collections'], JSON.stringify(collections))
      this.collectionsSubject.next([...collections])
    } catch (error) {
      console.error('Error saving collections to localStorage:', error)
      throw new Error('Failed to save collections. Storage might be full.')
    }
  }

  getCollections(): ICollection[] {
    return this.collectionsSubject.value
  }

  getCollection(id: string): ICollection | undefined {
    return this.getCollections().find(c => c.id === id)
  }

  createCollection(title: string, description: string): ICollection {
    const collections = this.getCollections()
    const now = new Date()

    const newCollection: ICollection = {
      id: Date.now().toString(),
      name: title,
      title: title,
      description,
      movies: [],
      createdAt: now,
      updatedAt: now
    }

    this.saveCollections([...collections, newCollection])
    return newCollection
  }

  updateCollection(id: string, updates: Partial<ICollection>): ICollection | null {
    const collections = this.getCollections()
    const collectionIndex = collections.findIndex(c => c.id === id)

    if (collectionIndex === -1) return null

    const updatedCollection = {
      ...collections[collectionIndex],
      ...updates,
      updatedAt: new Date()
    }

    collections[collectionIndex] = updatedCollection
    this.saveCollections(collections)

    return updatedCollection
  }

  deleteCollection(id: string): boolean {
    const collections = this.getCollections()
    const filteredCollections = collections.filter(c => c.id !== id)

    if (filteredCollections.length === collections.length) {
      return false
    }

    this.saveCollections(filteredCollections)
    return true
  }

  addMoviesToCollection(collectionId: string, movies: IMovie[]): void {
    const collections = this.getCollections()
    const collectionIndex = collections.findIndex(c => c.id === collectionId)

    if (collectionIndex !== -1) {
      const collection = collections[collectionIndex]
      const existingMovieIds = new Set(collection.movies.map(m => m.id))
      const moviesToAdd = movies.filter(m => !existingMovieIds.has(m.id))

      collection.movies = [...collection.movies, ...moviesToAdd]
      collection.updatedAt = new Date()

      collections[collectionIndex] = collection
      this.saveCollections(collections)
    }
  }

  removeMovieFromCollection(collectionId: string, movieId: number): void {
    const collections = this.getCollections()
    const collectionIndex = collections.findIndex(c => c.id === collectionId)

    if (collectionIndex !== -1) {
      const collection = collections[collectionIndex]
      collection.movies = collection.movies.filter(m => m.id !== movieId)
      collection.updatedAt = new Date()

      collections[collectionIndex] = collection
      this.saveCollections(collections)
    }
  }

  removeAllMoviesFromCollection(collectionId: string): void {
    const collections = this.getCollections()
    const collectionIndex = collections.findIndex(c => c.id === collectionId)

    if (collectionIndex !== -1) {
      const collection = collections[collectionIndex]
      collection.movies = []
      collection.updatedAt = new Date()

      collections[collectionIndex] = collection
      this.saveCollections(collections)
    }
  }

  saveSessionId(sessionId: string): void {
    localStorage.setItem(storageKeys['sessionId'], sessionId)

    if (sessionId) {
      this.saveSessionTimestamp(new Date().toISOString())
    } else {
      localStorage.removeItem(storageKeys['sessionTimestamp'])
    }
  }

  saveSessionTimestamp(timestamp: string): void {
    localStorage.setItem(storageKeys['sessionTimestamp'], timestamp)
  }

  getSessionTimestamp(): string | null {
    return localStorage.getItem(storageKeys['sessionTimestamp'])
  }

  getSessionId(): string | null {
    return localStorage.getItem(storageKeys['sessionId'])
  }

  setTheme(theme: TTheme): void {
    localStorage.setItem(storageKeys['theme'], theme)
    this.themeSubject.next(theme)
  }

  setLanguage(language: TLanguage): void {
    localStorage.setItem(storageKeys['language'], language)
    this.languageSubject.next(language)
  }

  clearAll(): void {
    localStorage.clear()
    this.collectionsSubject.next([])
    this.themeSubject.next(themes['light'])
    this.languageSubject.next(languages['en'])
  }

  getLanguage(): TLanguage {
    const language = localStorage.getItem(storageKeys['language'])
    return language ? (language as TLanguage) : languages['en']
  }
}
