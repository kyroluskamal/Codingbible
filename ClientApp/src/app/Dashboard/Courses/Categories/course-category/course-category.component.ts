import { Component, OnInit, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Store } from '@ngrx/store';
import { NotificationsService } from 'src/CommonServices/notifications.service';
import { FormControlNames, PostType, titleSeparatorCharacter, validators } from 'src/Helpers/constants';
import { CbTableDataSource, ColDefs } from 'src/Interfaces/interfaces';
import { CourseCategory } from 'src/models.model';
import { TreeDataStructureService } from 'src/Services/tree-data-structure.service';
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
  CourseCategoryToUpdate: CourseCategory | null = null;
  CourseCats$ = this.store.select(selectAllCourseCategorys);
  @ViewChild("CourseCategoryHandler") Modal!: CourseCategoryHandlerComponent;

  constructor(private store: Store, private title: Title,
    private TableTree: TreeDataStructureService<CourseCategory>,
    private NotificationService: NotificationsService)
  {
    this.title.setTitle(`Category ${titleSeparatorCharacter} Courses`);
  }

  ngOnInit(): void
  {
    this.store.dispatch(LoadCourseCategorys());
    this.CourseCats$.subscribe(cats =>
    {
      this.isLoading = false;
      this.TableTree.setData(cats);
      this.Categories = this.TableTree.finalFlatenArray();
    });

  }

  AddNewCategory(event: Boolean)
  {
    this.ActionType = PostType.Add;
    this.CourseCategoryToUpdate = null;
    if (event)
    {
      this.Modal.Toggle();
    }
  }
  EditCategory(event: CourseCategory)
  {
    console.log(event);
    this.CourseCategoryToUpdate = event;
    this.ActionType = PostType.Edit;
    this.Modal.Toggle();
  }
  DeleteCategory(event: CourseCategory)
  {
    this.NotificationService.Confirm_Swal().then(result =>
    {
      if (result.value)
      {
        this.store.dispatch(RemoveCourseCategory({ id: event.id, url: "", otherSlug: event.otherSlug! }));
        this.resetSelectedRow = true;
      }
    });
  }
}
