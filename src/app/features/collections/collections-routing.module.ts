import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { CollectionsListComponent } from '@features/collections/collections-list/collections-list.component'
import { CollectionDetailComponent } from '@features/collections/collection-detail/collection-detail.component'
import { CollectionCreateComponent } from '@features/collections/collection-create/collection-create.component'

const routes: Routes = [
  {
    path: '',
    component: CollectionsListComponent
  },
  {
    path: 'create',
    component: CollectionCreateComponent
  },
  {
    path: ':id',
    component: CollectionDetailComponent
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CollectionsRoutingModule {}
