import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { SearchComponent } from '@features/search/search.component'

const routes: Routes = [
  {
    path: '',
    component: SearchComponent
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes), SearchComponent],
  exports: [RouterModule]
})
export class SearchModule {}
