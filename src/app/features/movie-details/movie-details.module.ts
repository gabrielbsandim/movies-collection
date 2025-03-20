import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { MovieDetailsComponent } from './movie-details.component'

const routes: Routes = [
  {
    path: '',
    component: MovieDetailsComponent
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes), MovieDetailsComponent],
  exports: [RouterModule]
})
export class MovieDetailsModule {}
