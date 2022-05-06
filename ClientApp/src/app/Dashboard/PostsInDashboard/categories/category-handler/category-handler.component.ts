import { Component, OnInit, ChangeDetectionStrategy, ViewChild, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Update } from '@ngrx/entity';
import { Store } from '@ngrx/store';
import { BootstrapMoalComponent } from 'src/app/CommonComponents/bootstrap-modal/bootstrap-modal.component';
import { ClientSideValidationService } from 'src/CommonServices/client-side-validation.service';
import { BootstrapErrorStateMatcher } from 'src/Helpers/bootstrap-error-state-matcher';
import { FormControlNames, FormFieldsNames, FormValidationErrors, FormValidationErrorsNames, InputFieldTypes, PostType } from 'src/Helpers/constants';
import { Category } from 'src/models.model';
import { TreeDataStructureService } from 'src/Services/tree-data-structure.service';
import { AddCATEGORY, UpdateCATEGORY, UpdateCATEGORY_Sucess } from 'src/State/CategoriesState/Category.actions';
import { selectAllCategorys, selectCategoryByID, select_Category_ValidationErrors } from 'src/State/CategoriesState/Category.reducer';


@Component({
  selector: 'Category-handler',
  templateUrl: './category-handler.component.html',
  styleUrls: ['./category-handler.component.css'],
})
export class CategoryHandlerComponent implements OnInit, OnChanges
{
  @ViewChild("modal") modal!: BootstrapMoalComponent;
  ValidationErrors$ = this.store.select(select_Category_ValidationErrors);

  PostType = PostType;
  catsForSelectmenu: Category[] = [];
  errorState = new BootstrapErrorStateMatcher();
  InputFieldTypes = InputFieldTypes;
  FormControlNames = FormControlNames;
  FormValidationErrorsNames = FormValidationErrorsNames;
  FormValidationErrors = FormValidationErrors;
  FormFieldsNames = FormFieldsNames;
  cats$ = this.store.select(selectAllCategorys);
  @Input() inputForm: FormGroup = new FormGroup({});
  category: Category = new Category();
  @Input() ActionType: string = "";
  Form: FormGroup = new FormGroup({});
  OldLevel: number = 0;
  constructor(private store: Store,
    private clientSideSevice: ClientSideValidationService,)
  {
    if (this.ActionType == PostType.Edit)
    {
      let parent = this.catsForSelectmenu.filter(cat => cat.id == this.Form.get("id")?.value)[0];
      this.OldLevel = parent?.level;
    }
  }
  ngOnChanges(changes: SimpleChanges): void
  {
    if ("inputForm" in changes)
    {
      this.Form = this.inputForm;
    }
  }

  ngOnInit(): void
  {
    this.Form = this.inputForm;
    this.cats$.subscribe(cats =>
    {
      let TreeDataStructure = new TreeDataStructureService(cats, "parentKey");
      this.catsForSelectmenu = TreeDataStructure.finalFlatenArray();
    });
  }

  Toggle()
  {
    this.modal.Toggle();
  }
  onChange(event: HTMLSelectElement)
  {
    this.Form.get(FormControlNames.categoryForm.parentkey)?.setValue(Number(event.value));
  }
  Submit()
  {
    this.Form.markAllAsTouched();
    let newCategory = new Category();
    this.clientSideSevice.FillObjectFromForm(newCategory, this.Form);
    if (newCategory.parentKey === 0)
    {
      newCategory.parentKey = null;
    }
    let parent = this.catsForSelectmenu.filter(cat => cat.id == newCategory.parentKey)[0];
    if (newCategory.parentKey === 0 || newCategory.parentKey === null || parent == null)
    {
      newCategory.level = 0;
    } else
    {
      newCategory.level = parent?.level! + 1;
    }
    newCategory.slug = newCategory.title.split(" ").join("-");
    this.store.dispatch(AddCATEGORY(newCategory));
  }
  ModelIsClosed()
  {
    this.Form.reset();
  }
  Update()
  {
    this.Form.markAllAsTouched();
    let newCategory = new Category();
    this.clientSideSevice.FillObjectFromForm(newCategory, this.Form);
    if (newCategory.parentKey === 0)
    {
      newCategory.parentKey = null;
    }
    let parent = this.catsForSelectmenu.filter(cat => cat.id == newCategory.parentKey)[0];

    if (newCategory.parentKey === 0 || parent == null)
    {
      newCategory.level = 0;
    } else
    {
      newCategory.level = parent?.level! + 1;
    }
    newCategory.slug = newCategory.title.split(" ").join("-");
    this.store.dispatch(UpdateCATEGORY(newCategory));
  }

  // updateCategoryLevelInStore(category: Category)
  // {
  //   let children = this.catsForSelectmenu.filter(cat => cat.parentKey == category.id);
  //   if (children.length > 0)
  //   {
  //     children.forEach(child =>
  //     {
  //       let ch = new Category();
  //       ch = { ...child, level: category.level! + 1 };
  //       let x: Update<Category> = {
  //         id: child.id,
  //         changes: ch
  //       };
  //       this.store.dispatch(UpdateCATEGORY_Sucess({ CATEGORY: x }));
  //       this.updateCategoryLevelInStore(child);
  //     });
  //   }
  // }
}
