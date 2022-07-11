import { Component, OnInit, ChangeDetectionStrategy, ViewChild, Input, SimpleChanges, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { BootstrapMoalComponent } from 'src/app/CommonComponents/bootstrap-modal/bootstrap-modal.component';
import { ClientSideValidationService } from 'src/CommonServices/client-side-validation.service';
import { BootstrapErrorStateMatcher } from 'src/Helpers/bootstrap-error-state-matcher';
import { ArabicRegex, FormControlNames, FormFieldsNames, FormValidationErrors, FormValidationErrorsNames, InputFieldTypes, PostType, validators } from 'src/Helpers/constants';
import { CourseCategory } from 'src/models.model';
import { TreeDataStructureService } from 'src/Services/tree-data-structure.service';
import { AddCourseCategory, UpdateCourseCategory } from 'src/State/CourseCategoryState/CourseCategory.actions';
import { selectAllCourseCategorys, select_CourseCategorys_ValidationErrors } from 'src/State/CourseCategoryState/CourseCategory.reducer';

@Component({
  selector: 'course-category-handler',
  templateUrl: './course-category-handler.component.html',
  styleUrls: ['./course-category-handler.component.css'],
})
export class CourseCategoryHandlerComponent implements OnInit, OnChanges
{
  @ViewChild("CourseCategoryHandler") modal!: BootstrapMoalComponent;
  ValidationErrors$ = this.store.select(select_CourseCategorys_ValidationErrors);

  PostType = PostType;
  catsForSelectmenu: CourseCategory[] = [];
  errorState = new BootstrapErrorStateMatcher();
  InputFieldTypes = InputFieldTypes;
  FormControlNames = FormControlNames;
  FormValidationErrorsNames = FormValidationErrorsNames;
  FormValidationErrors = FormValidationErrors;
  FormFieldsNames = FormFieldsNames;
  cats$ = this.store.select(selectAllCourseCategorys);
  selectedTranslation: CourseCategory[] = [];
  category: CourseCategory = new CourseCategory();
  AllCategories: CourseCategory[] = [];
  @Input() ActionType: string = "";
  @Input() UpdateObject: CourseCategory | null = null;
  Form: FormGroup = new FormGroup({});
  OldLevel: number = 0;
  CatToAddOrUpdate: CourseCategory = new CourseCategory();
  constructor(private store: Store, private fb: FormBuilder,
    private TreeDataStructure: TreeDataStructureService<CourseCategory>,
    public clientSideSevice: ClientSideValidationService,)
  {
    if (this.ActionType == PostType.Edit)
    {
      let parent = this.catsForSelectmenu.filter(cat => cat.id == this.Form.get("id")?.value)[0];
      this.OldLevel = parent?.level;
    }
  }
  ngOnChanges(changes: SimpleChanges): void
  {
    if ("UpdateObject" in changes)
    {
      this.SetIsArabicAndTranslation();
    }
    if ("ActionType" in changes)
    {
      if (this.ActionType == PostType.Edit)
        this.SetIsArabicAndTranslation();
      else
      {
        this.Form.get(FormControlNames.courseCategoryForm.isArabic)?.setValue(false);
        this.Form.reset();
      }
    }
  }

  ngOnInit(): void
  {
    this.Form = this.fb.group({
      id: [0],
      [FormControlNames.courseCategoryForm.name]: ['', [validators.required]],
      [FormControlNames.courseCategoryForm.title]: ['', [validators.required, validators.SEO_TITLE_MIN_LENGTH, validators.SEO_TITLE_MAX_LENGTH]],
      [FormControlNames.courseCategoryForm.description]: ['', [validators.required, validators.SEO_DESCRIPTION_MIN_LENGTH, validators.SEO_DESCRIPTION_MAX_LENGTH]],
      [FormControlNames.courseCategoryForm.parentKey]: [0, [validators.required]],
      [FormControlNames.courseCategoryForm.isArabic]: [{ value: false, disabled: true }],
      [FormControlNames.courseCategoryForm.otherSlug]: [null, [validators.required]],
    });
    this.cats$.subscribe(cats =>
    {
      this.AllCategories = cats;
      this.SelectTranslation();
    });
  }

  Toggle()
  {
    this.modal.Toggle();
    this.ModelIsClosed();
    if (this.ActionType === PostType.Edit)
    { this.SetIsArabicAndTranslation(); this.setIsArabic(); }
  }
  onChange(event: HTMLSelectElement)
  {
    this.Form.get(FormControlNames.courseCategoryForm.parentKey)?.setValue(Number(event.value));
  }
  Submit()
  {
    this.Form.markAllAsTouched();
    this.CatToAddOrUpdate = new CourseCategory();
    this.clientSideSevice.FillObjectFromForm(this.CatToAddOrUpdate, this.Form);
    if (this.CatToAddOrUpdate.parentKey === 0)
    {
      this.CatToAddOrUpdate.parentKey = null;
    }
    let parent = this.catsForSelectmenu.filter(cat => cat.id == this.CatToAddOrUpdate.parentKey)[0];
    if (this.CatToAddOrUpdate.parentKey === 0 || this.CatToAddOrUpdate.parentKey === null || parent == null)
    {
      this.CatToAddOrUpdate.level = 0;
    } else
    {
      this.CatToAddOrUpdate.level = parent?.level! + 1;
    }
    this.CatToAddOrUpdate.slug = this.clientSideSevice.GenerateSlug(this.CatToAddOrUpdate.title);
    if (this.CatToAddOrUpdate.otherSlug === "0")
    {
      this.CatToAddOrUpdate.otherSlug = null;
    }
    this.store.dispatch(AddCourseCategory(this.CatToAddOrUpdate));
  }
  ModelIsClosed()
  {
    this.Form.reset();
  }
  Update()
  {
    this.Form.markAllAsTouched();
    this.CatToAddOrUpdate = new CourseCategory();
    this.clientSideSevice.FillObjectFromForm(this.CatToAddOrUpdate, this.Form);
    if (this.CatToAddOrUpdate.parentKey === 0)
    {
      this.CatToAddOrUpdate.parentKey = null;
    }
    let parent = this.catsForSelectmenu.filter(cat => cat.id == this.CatToAddOrUpdate.parentKey)[0];

    if (this.CatToAddOrUpdate.parentKey === 0 || parent == null)
    {
      this.CatToAddOrUpdate.level = 0;
    } else
    {
      this.CatToAddOrUpdate.level = parent?.level! + 1;
    }
    this.CatToAddOrUpdate.slug = this.clientSideSevice.GenerateSlug(this.CatToAddOrUpdate.title);
    if (this.CatToAddOrUpdate.otherSlug === "0")
    {
      this.CatToAddOrUpdate.otherSlug = null;
    }
    this.store.dispatch(UpdateCourseCategory(this.CatToAddOrUpdate));
  }
  SelectTranslation()
  {
    this.TreeDataStructure.setData(this.AllCategories.filter(x => x.isArabic
      === Boolean(this.Form.get(FormControlNames.courseCategoryForm.isArabic)?.value)));
    this.catsForSelectmenu = this.TreeDataStructure.finalFlatenArray();

    let treeService = new TreeDataStructureService<CourseCategory>();
    treeService.setData(this.AllCategories.filter(x => x.isArabic
      !== Boolean(this.Form.get(FormControlNames.courseCategoryForm.isArabic)?.value)));
    this.selectedTranslation = treeService.finalFlatenArray();
  }
  SetIsArabicAndTranslation()
  {
    if (this.ActionType == PostType.Add)

      this.Form.get(FormControlNames.courseCategoryForm.isArabic)?.setValue(false);

    this.clientSideSevice.inputRedirection(Boolean(this.Form.get(FormControlNames.courseCategoryForm.isArabic)?.value));
    if (this.UpdateObject)
    {
      this.Form.get("parentkey")?.setValue(this.UpdateObject.parentKey);
      this.Form.patchValue(this.UpdateObject);
      if (this.UpdateObject.otherSlug === null)
      {
        this.Form.get(FormControlNames.courseCategoryForm.otherSlug)?.setValue("0");
      }
      if (this.UpdateObject.parentKey === null)
      {
        this.Form.get(FormControlNames.courseCategoryForm.parentKey)?.setValue("0");
      }
      if (this.UpdateObject.slug.toLowerCase() === "uncategorized" || this.UpdateObject.slug.toLowerCase() === "غير-مصنف")
      {
        this.Form.get(FormControlNames.courseCategoryForm.title)?.clearValidators();
        this.Form.get(FormControlNames.courseCategoryForm.description)?.clearValidators();
      }
      this.Form.get(FormControlNames.courseCategoryForm.isArabic)?.setValue(this.UpdateObject.isArabic);
      this.Form.markAllAsTouched();
    }
    this.SelectTranslation();
    this.clientSideSevice.inputRedirection(Boolean(this.Form.get(FormControlNames.courseCategoryForm.isArabic)?.value));
  }

  setIsArabic(formControlName: string = "")
  {
    let isArabic = ArabicRegex.test(this.Form.get(formControlName)?.value);
    this.clientSideSevice.setIsArabic(isArabic, this.UpdateObject?.isArabic!,
      this.UpdateObject, this.Form, this.ActionType, "Category");
    this.SelectTranslation();
    this.clientSideSevice.inputRedirection(this.Form.get(FormControlNames.courseForm.isArabic)?.value);
  }
}
