import { NgModule } from '@angular/core'
import { CollectionsRoutingModule } from '@features/collections/collections-routing.module'
import { CollectionsListComponent } from '@features/collections/collections-list/collections-list.component'
import { CollectionDetailComponent } from '@features/collections/collection-detail/collection-detail.component'
import { CollectionCreateComponent } from '@features/collections/collection-create/collection-create.component'

@NgModule({
  imports: [
    CollectionsRoutingModule,
    CollectionsListComponent,
    CollectionDetailComponent,
    CollectionCreateComponent
  ]
})
export class CollectionsModule {}
