import { Routes } from '@angular/router'
import { SearchComponent } from './features/search/search.component'

export const routes: Routes = [
  {
    path: '',
    component: SearchComponent
  },
  {
    path: 'movie/:id',
    loadChildren: () =>
      import('./features/movie-details/movie-details.module').then(m => m.MovieDetailsModule)
  },
  {
    path: 'collections',
    loadChildren: () =>
      import('./features/collections/collections.module').then(m => m.CollectionsModule)
  },
  {
    path: '**',
    redirectTo: ''
  }
]
