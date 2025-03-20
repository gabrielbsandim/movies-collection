import { ComponentFixture, TestBed } from '@angular/core/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { MatSnackBarModule } from '@angular/material/snack-bar'
import { MatDialogModule, MatDialog } from '@angular/material/dialog'
import { NoopAnimationsModule } from '@angular/platform-browser/animations'
import { of } from 'rxjs'
import { CollectionsListComponent } from '@features/collections/collections-list/collections-list.component'
import { StorageService } from '@core/services/storage/storage.service'
import { SharedModule } from '@shared/shared.module'
import { ICollection } from '@core/models/collection/collection.model'

describe('CollectionsListComponent', () => {
  let component: CollectionsListComponent
  let fixture: ComponentFixture<CollectionsListComponent>
  let storageServiceSpy: jasmine.SpyObj<StorageService>
  let dialogSpy: jasmine.SpyObj<MatDialog>

  const mockCollections: ICollection[] = [
    {
      id: '1',
      name: 'Test Collection 1',
      title: 'Test Collection 1',
      description: 'Description 1',
      movies: [],
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]

  beforeEach(async () => {
    const storageSpy = jasmine.createSpyObj(
      'StorageService',
      ['getCollections', 'deleteCollection'],
      {
        collections$: of([mockCollections[0]])
      }
    )

    const matDialogSpy = jasmine.createSpyObj('MatDialog', ['open'])

    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        MatSnackBarModule,
        MatDialogModule,
        NoopAnimationsModule,
        SharedModule,
        CollectionsListComponent
      ],
      providers: [
        { provide: StorageService, useValue: storageSpy },
        { provide: MatDialog, useValue: matDialogSpy }
      ]
    }).compileComponents()

    storageServiceSpy = TestBed.inject(StorageService) as jasmine.SpyObj<StorageService>
    dialogSpy = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>

    storageServiceSpy.getCollections.and.returnValue([mockCollections[0]])

    fixture = TestBed.createComponent(CollectionsListComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should load collections on init', () => {
    expect(storageServiceSpy.getCollections).toHaveBeenCalled()
    expect(component.collections).toEqual([mockCollections[0]])
  })

  it('should delete collection after confirmation', () => {
    dialogSpy.open.and.returnValue({
      afterClosed: () => of(true)
    } as any)

    storageServiceSpy.deleteCollection.and.returnValue(true)

    const event = new MouseEvent('click')
    spyOn(event, 'stopPropagation')

    component.deleteCollection(event, '1')

    expect(event.stopPropagation).toHaveBeenCalled()
    expect(dialogSpy.open).toHaveBeenCalled()
    expect(storageServiceSpy.deleteCollection).toHaveBeenCalledWith('1')
  })

  it('should not delete collection if not confirmed', () => {
    dialogSpy.open.and.returnValue({
      afterClosed: () => of(false)
    } as any)

    const event = new MouseEvent('click')
    spyOn(event, 'stopPropagation')

    component.deleteCollection(event, '1')

    expect(dialogSpy.open).toHaveBeenCalled()
    expect(storageServiceSpy.deleteCollection).not.toHaveBeenCalled()
  })
})
