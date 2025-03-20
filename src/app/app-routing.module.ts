import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./features/search/search.module').then(m => m.SearchModule)
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

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
