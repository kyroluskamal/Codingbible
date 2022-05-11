import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { BootstrapMoalComponent } from 'src/app/CommonComponents/bootstrap-modal/bootstrap-modal.component';
import { NotificationsService } from 'src/CommonServices/notifications.service';
import { PostType } from 'src/Helpers/constants';
import { DashboardRoutes } from 'src/Helpers/router-constants';
import { CbTableDataSource, ColDefs } from 'src/Interfaces/interfaces';
import { Course } from 'src/models.model';
import { LoadCourses, RemoveCourse } from 'src/State/CourseState/course.actions';
import { selectAllCourses } from 'src/State/CourseState/course.reducer';

@Component({
  selector: 'app-show-all-courses',
  templateUrl: './show-all-courses.component.html',
  styleUrls: ['./show-all-courses.component.css']
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
  ActionType = PostType;
  Action: string = "";
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

  AddNewCourse(event: Boolean, AddCourseModal: BootstrapMoalComponent)
  {
    if (event)
    {
      this.Action = PostType.Add;
      AddCourseModal.Toggle();
    }
  }
  EditCourse(event: Course)
  {
    this.Action = PostType.Edit;
  }
  DeleteCourse(event: Course)
  {
    this.NotificationService.Confirm_Swal().then(result =>
    {
      if (result.value)
      {
        this.store.dispatch(RemoveCourse({ id: event.id, url: "" }));
        this.resetSelectedRow = true;
      }
    });
  }

}
