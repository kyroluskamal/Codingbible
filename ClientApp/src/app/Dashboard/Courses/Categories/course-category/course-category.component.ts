import { Component, OnInit, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Store } from '@ngrx/store';
import { NotificationsService } from 'src/CommonServices/notifications.service';
import { FormControlNames, PostType, validators } from 'src/Helpers/constants';
import { CbTableDataSource, ColDefs } from 'src/Interfaces/interfaces';
import { CourseCategory } from 'src/models.model';
import { LoadCATEGORYs } from 'src/State/CategoriesState/Category.actions';
import { LoadCourseCategorys, RemoveCourseCategory } from 'src/State/CourseCategoryState/CourseCategory.actions';
import { selectAllCourseCategorys } from 'src/State/CourseCategoryState/CourseCategory.reducer';
import { CourseCategoryHandlerComponent } from '../course-category-handler/course-category-handler.component';

@Component({
  selector: 'app-course-category',
  templateUrl: './course-category.component.html',
  styleUrls: ['./course-category.component.css'],
})
export class CourseCategoryComponent implements OnInit
{
  ActionType = "";
  colDefs: ColDefs[] = [
    { field: "name", display: "Name", },
    { field: "level", display: "Level", },
  ];
  resetSelectedRow: boolean = false;
  dataSource: CbTableDataSource<CourseCategory> = new CbTableDataSource<CourseCategory>();
  isLoading: boolean = true;
  Categories: CourseCategory[] = [];
  CourseCats$ = this.store.select(selectAllCourseCategorys);
  Form: FormGroup = new FormGroup({});
  @ViewChild("CourseCategoryHandler") Modal!: CourseCategoryHandlerComponent;

  constructor(private store: Store, private fb: FormBuilder, private title: Title,
    private NotificationService: NotificationsService)
  {
    this.store.dispatch(LoadCourseCategorys());

    this.title.setTitle("Courses >> Category");
  }

  ngOnInit(): void
  {
    this.CourseCats$.subscribe(cats =>
    {
      this.isLoading = false;
      this.Categories = cats;
    });
    this.Form = this.fb.group({
      id: [0],
      name: ['', [validators.required]],
      title: ['', [validators.required, validators.SEO_TITLE_MIN_LENGTH, validators.SEO_TITLE_MAX_LENGTH]],
      description: ['', [validators.required, validators.SEO_DESCRIPTION_MIN_LENGTH, validators.SEO_DESCRIPTION_MAX_LENGTH]],
      parentkey: [0, [validators.required]]
    });
  }

  AddNewCategory(event: Boolean)
  {
    this.ActionType = PostType.Add;
    if (event)
    {
      this.Modal.Toggle();
    }
  }
  EditCategory(event: CourseCategory)
  {
    this.ActionType = PostType.Edit;
    this.Form.patchValue(event);
    if (event.parentKey !== null)
      this.Form.get(FormControlNames.categoryForm.parentkey)?.setValue(event.parentKey);
    else
      this.Form.get(FormControlNames.categoryForm.parentkey)?.setValue(0);
    this.Modal.Toggle();
  }
  DeleteCategory(event: CourseCategory)
  {
    this.NotificationService.Confirm_Swal().then(result =>
    {
      if (result.value)
      {
        this.store.dispatch(RemoveCourseCategory({ id: event.id, url: "" }));
        this.resetSelectedRow = true;
      }
    });
  }
}
