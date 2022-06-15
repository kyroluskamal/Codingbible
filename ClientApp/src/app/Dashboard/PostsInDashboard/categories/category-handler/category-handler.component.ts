import { Component, OnInit, ViewChild, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { BootstrapMoalComponent } from 'src/app/CommonComponents/bootstrap-modal/bootstrap-modal.component';
import { ClientSideValidationService } from 'src/CommonServices/client-side-validation.service';
import { BootstrapErrorStateMatcher } from 'src/Helpers/bootstrap-error-state-matcher';
import { FormControlNames, FormFieldsNames, FormValidationErrors, FormValidationErrorsNames, InputFieldTypes, PostType } from 'src/Helpers/constants';
import { Category } from 'src/models.model';
import { TreeDataStructureService } from 'src/Services/tree-data-structure.service';
import { AddCATEGORY, UpdateCATEGORY } from 'src/State/CategoriesState/Category.actions';
import { selectAllCategorys, select_Category_ValidationErrors } from 'src/State/CategoriesState/Category.reducer';


@Component({
  selector: 'Category-handler',
  templateUrl: './category-handler.component.html',
  styleUrls: ['./category-handler.component.css'],
})
export class CategoryHandlerComponent implements OnInit, OnChanges
{
  @ViewChild("PostCategory") modal!: BootstrapMoalComponent;
  ValidationErrors$ = this.store.select(select_Category_ValidationErrors);

  PostType = PostType;
  catsForSelectmenu: Category[] = [];
  errorState = new BootstrapErrorStateMatcher();
  InputFieldTypes = InputFieldTypes;
  FormControlNames = FormControlNames;
  FormValidationErrorsNames = FormValidationErrorsNames;
  FormValidationErrors = FormValidationErrors;
  FormFieldsNames = FormFieldsNames;
  selectedTranslation: Category[] = [];
  AllCategories: Category[] = [];
  cats$ = this.store.select(selectAllCategorys);
  @Input() inputForm: FormGroup = new FormGroup({});
  category: Category = new Category();
  @Input() ActionType: string = "";
  Form: FormGroup = new FormGroup({});
  OldLevel: number = 0;
  newCategory: Category = new Category();
  constructor(private store: Store, private TreeDataStructure: TreeDataStructureService<Category>,
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
      this.AllCategories = cats;
    });
  }

  Toggle()
  {
    this.modal.Toggle();
  }
  onChange(event: HTMLSelectElement)
  {
    this.Form.get(FormControlNames.categoryForm.parentKey)?.setValue(Number(event.value));
  }
  Submit()
  {
    this.Form.markAllAsTouched();
    this.newCategory = new Category();
    this.clientSideSevice.FillObjectFromForm(this.newCategory, this.Form);
    if (this.newCategory.parentKey === 0)
    {
      this.newCategory.parentKey = null;
    }
    let parent = this.catsForSelectmenu.filter(cat => cat.id == this.newCategory.parentKey)[0];
    if (this.newCategory.parentKey === 0 || this.newCategory.parentKey === null || parent == null)
    {
      this.newCategory.level = 0;
    } else
    {
      this.newCategory.level = parent?.level! + 1;
    }
    this.newCategory.slug = this.newCategory.title.split(" ").join("-");
    this.store.dispatch(AddCATEGORY(this.newCategory));
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
  SelectTranslation()
  {
    this.TreeDataStructure.setData(this.AllCategories.filter(x => x.isArabic
      === Boolean(this.Form.get(FormControlNames.categoryForm.isArabic)?.value)));
    this.catsForSelectmenu = this.TreeDataStructure.finalFlatenArray();

    let tree = new TreeDataStructureService<Category>();
    tree.setData(this.AllCategories.filter(x => x.isArabic
      !== Boolean(this.Form.get(FormControlNames.categoryForm.isArabic)?.value)));
    this.selectedTranslation = tree.finalFlatenArray();
  }
}
