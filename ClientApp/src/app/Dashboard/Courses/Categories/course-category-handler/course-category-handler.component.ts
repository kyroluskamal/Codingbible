import { Component, OnInit, ChangeDetectionStrategy, ViewChild, Input, SimpleChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { BootstrapMoalComponent } from 'src/app/CommonComponents/bootstrap-modal/bootstrap-modal.component';
import { ClientSideValidationService } from 'src/CommonServices/client-side-validation.service';
import { BootstrapErrorStateMatcher } from 'src/Helpers/bootstrap-error-state-matcher';
import { FormControlNames, FormFieldsNames, FormValidationErrors, FormValidationErrorsNames, InputFieldTypes, PostType } from 'src/Helpers/constants';
import { CourseCategory } from 'src/models.model';
import { TreeDataStructureService } from 'src/Services/tree-data-structure.service';
import { AddCourseCategory, UpdateCourseCategory } from 'src/State/CourseCategoryState/CourseCategory.actions';
import { selectAllCourseCategorys, select_CourseCategorys_ValidationErrors } from 'src/State/CourseCategoryState/CourseCategory.reducer';

@Component({
  selector: 'course-category-handler',
  templateUrl: './course-category-handler.component.html',
  styleUrls: ['./course-category-handler.component.css'],
})
export class CourseCategoryHandlerComponent implements OnInit
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
  @Input() inputForm: FormGroup = new FormGroup({});
  category: CourseCategory = new CourseCategory();
  @Input() ActionType: string = "";
  Form: FormGroup = new FormGroup({});
  OldLevel: number = 0;
  constructor(private store: Store, private TreeDataStructure: TreeDataStructureService<CourseCategory>,
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
      this.TreeDataStructure.setData(cats);
      this.catsForSelectmenu = this.TreeDataStructure.finalFlatenArray();
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
    console.log("Submit");

    this.Form.markAllAsTouched();
    let newCategory = new CourseCategory();
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
    this.store.dispatch(AddCourseCategory(newCategory));
  }
  ModelIsClosed()
  {
    this.Form.reset();
  }
  Update()
  {
    this.Form.markAllAsTouched();
    let newCategory = new CourseCategory();
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
    this.store.dispatch(UpdateCourseCategory(newCategory));
  }
}
