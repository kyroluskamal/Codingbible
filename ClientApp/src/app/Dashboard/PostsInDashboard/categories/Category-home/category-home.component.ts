import { Component, OnInit, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { ClientSideValidationService } from 'src/CommonServices/client-side-validation.service';
import { NotificationsService } from 'src/CommonServices/notifications.service';
import { FormControlNames, PostType, validators } from 'src/Helpers/constants';
import { CbTableDataSource, ColDefs } from 'src/Interfaces/interfaces';
import { Category } from 'src/models.model';
import { LoadCATEGORYs, RemoveCATEGORY } from 'src/State/CategoriesState/Category.actions';
import { selectAllCategorys } from 'src/State/CategoriesState/Category.reducer';
import { CategoryHandlerComponent } from '../category-handler/category-handler.component';
import { TreeDataStructureService } from 'src/Services/tree-data-structure.service';
import { Title } from '@angular/platform-browser';
@Component({
  selector: 'app-gategory-home',
  templateUrl: './category-home.component.html',
  styleUrls: ['./category-home.component.css'],
})
export class CategoryHomeComponent implements OnInit
{
  Type = "";
  colDefs: ColDefs[] = [
    { field: "name", display: "Name", },
    { field: "level", display: "Level", },
  ];
  resetSelectedRow: boolean = false;
  dataSource: CbTableDataSource<Category> = new CbTableDataSource<Category>();
  isLoading: boolean = true;
  Categories: Category[] = [];
  Cats$ = this.store.select(selectAllCategorys);
  Form: FormGroup = new FormGroup({});
  CatToAddOrUpdate: Category | null = null;
  @ViewChild("Modal") Modal!: CategoryHandlerComponent;

  constructor(private store: Store, private fb: FormBuilder, private title: Title,
    private TableTree: TreeDataStructureService<Category>,
    private NotificationService: NotificationsService)
  {
    this.title.setTitle("Post categories");
  }

  ngOnInit(): void
  {
    this.store.dispatch(LoadCATEGORYs());
    this.Cats$.subscribe(cats =>
    {
      this.isLoading = false;
      this.TableTree.setData(cats);
      this.Categories = this.TableTree.finalFlatenArray();
    });
    this.Form = this.fb.group({
      id: [0],
      [FormControlNames.categoryForm.name]: ['', [validators.required]],
      [FormControlNames.categoryForm.title]: ['', [validators.required, validators.SEO_TITLE_MIN_LENGTH, validators.SEO_TITLE_MAX_LENGTH]],
      [FormControlNames.categoryForm.description]: ['', [validators.required, validators.SEO_DESCRIPTION_MIN_LENGTH, validators.SEO_DESCRIPTION_MAX_LENGTH]],
      [FormControlNames.categoryForm.parentKey]: [null, [validators.required]],
      [FormControlNames.categoryForm.isArabic]: [{ value: false, disabled: true }],
      [FormControlNames.categoryForm.otherSlug]: [null, [validators.required]],
    });
  }

  AddNewCategory(event: Boolean)
  {
    this.Type = PostType.Add;
    if (event)
    {
      this.CatToAddOrUpdate = null;
      this.Form.reset();
      this.Form.get(FormControlNames.categoryForm.isArabic)?.setValue(false);
      this.Modal.Toggle();
    }
  }
  EditCategory(event: Category)
  {
    this.Type = PostType.Edit;
    this.CatToAddOrUpdate = event;
    this.Form.patchValue(event);
    if (event.parentKey !== null)
      this.Form.get(FormControlNames.categoryForm.parentKey)?.setValue(event.parentKey);
    else
      this.Form.get(FormControlNames.categoryForm.parentKey)?.setValue(0);
    if (event.otherSlug === null)
    {
      this.Form.get(FormControlNames.categoryForm.otherSlug)?.setValue('0');
    }
    if (event.slug.toLowerCase() === "uncategorized" || event.slug === "غير-مصنف")
    {
      this.Form.get(FormControlNames.categoryForm.title)?.clearValidators();
      this.Form.get(FormControlNames.categoryForm.description)?.clearValidators();
    }
    this.Form.get(FormControlNames.categoryForm.isArabic)?.setValue(event.isArabic);
    this.Form.markAllAsTouched();
    this.Modal.Toggle();
  }
  DeleteCategory(event: Category)
  {
    this.NotificationService.Confirm_Swal().then(result =>
    {
      if (result.value)
      {
        this.store.dispatch(RemoveCATEGORY({ id: event.id, url: "", otherSlug: event.otherSlug! }));
        this.resetSelectedRow = true;
      }
    });
  }

}
