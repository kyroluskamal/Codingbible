import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { NotificationsService } from 'src/CommonServices/notifications.service';
import { CourseDifficultyLevel, FormControlNames, PostType } from 'src/Helpers/constants';
import { DashboardRoutes } from 'src/Helpers/router-constants';
import { CbTableDataSource, ColDefs } from 'src/Interfaces/interfaces';
import { Attachments, Course } from 'src/models.model';
import { SelectAttachment } from 'src/State/Attachments/Attachments.actions';
import { ChangeStatus, LoadCourses, RemoveCourse } from 'src/State/CourseState/course.actions';
import { selectAllCourses, selectCourseByID } from 'src/State/CourseState/course.reducer';

@Component({
  selector: 'app-show-all-courses',
  templateUrl: './show-all-courses.component.html',
  styleUrls: ['./show-all-courses.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShowAllCoursesComponent implements OnInit
{
  colDefs: ColDefs[] = [
    { field: "id", display: "#" },
    { field: "name", display: "Title", },
    { field: "author", display: "Author", isObject: true, KeyToShowIfObjectTrue: "firstname" },
    { field: "lastModified", display: "Modified", pipe: "date" },
    { field: "status", display: "Status", pipe: "postStatus" },
  ];
  resetSelectedRow: boolean = false;
  dataSource: CbTableDataSource<Course> = new CbTableDataSource<Course>();
  Courses$ = this.store.select(selectAllCourses);
  isLoading = true;
  Action: string = "";
  CourseToAddOrUpdate: Course = new Course();
  CourseForm: FormGroup = new FormGroup({});
  DifficultyLevels = CourseDifficultyLevel;
  SelectedCourse: Course = new Course();
  constructor(private store: Store, private title: Title,
    private router: Router, private NotificationService: NotificationsService)
  {
    this.title.setTitle("Courses");
  }

  ngOnInit(): void
  {
    this.store.dispatch(LoadCourses());
    this.Courses$.subscribe(Courses =>
    {
      this.isLoading = false;
      this.dataSource.data = Courses;
    });
  }

  AddNewCourse(event: Boolean)
  {
    if (event)
    {
      this.router.navigate(['', DashboardRoutes.Home, DashboardRoutes.Courses.Home, DashboardRoutes.Courses.Wizard], { queryParams: { action: PostType.Add } });
    }
  }
  EditCourse(event: Course)
  {
    if (event)
    {
      this.router.navigate(['', DashboardRoutes.Home, DashboardRoutes.Courses.Home, DashboardRoutes.Courses.Wizard], { queryParams: { action: PostType.Edit, step: "step1", courseId: event.id } });
    }
    this.CourseToAddOrUpdate = event;
    this.Action = PostType.Edit;
  }
  DeleteCourse(event: Course)
  {
    this.NotificationService.Confirm_Swal().then(result =>
    {
      if (result.value)
      {
        this.store.dispatch(RemoveCourse({ id: event.id, url: "", otherSlug: event.otherSlug! }));
        this.resetSelectedRow = true;
      }
    });
  }
  SetFeatureImage(attachment: Attachments | null)
  {
    this.CourseToAddOrUpdate.featureImageUrl = attachment?.fileUrl!;
  }
  removeFeatureImage()
  {
    this.store.dispatch(SelectAttachment({ selectedFile: null }));
    this.CourseToAddOrUpdate.featureImageUrl = "";
    this.CourseForm.get(FormControlNames.courseForm.featureImageUrl)?.setValue("");
  }
  SelectCourse(event: Course)
  {
    this.SelectedCourse = event;
    this.CourseToAddOrUpdate = event;
  }
  ChangeStatus(status: number)
  {
    let CourseToUpdate = { ...this.SelectedCourse };
    CourseToUpdate.status = status;
    this.store.dispatch(ChangeStatus(CourseToUpdate));
    this.store.select(selectCourseByID(this.SelectedCourse.id)).subscribe(course =>
    {
      if (course)
        this.SelectCourse(course);
    });
  }
}
