import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { SpinnerService } from 'src/CommonServices/spinner.service';
import { PostType } from 'src/Helpers/constants';
import { DashboardRoutes } from 'src/Helpers/router-constants';
import { CbTableDataSource, ColDefs } from 'src/Interfaces/interfaces';
import { Lesson, Section } from 'src/models.model';
import { TreeDataStructureService } from 'src/Services/tree-data-structure.service';
import { LoadCourses } from 'src/State/CourseState/course.actions';
import { selectAllCourses } from 'src/State/CourseState/course.reducer';
import { ChangeStatus, GetLessonsByCourseId, LessonAdditionIsComplete, LessonUpdateIsCompleted, LoadLessons, RemoveLesson } from 'src/State/LessonsState/Lessons.actions';
import { selectAllLessons, selectLessonsByID, Select_Lesson_AdditionState, Select_Lesson_UpdateState } from 'src/State/LessonsState/Lessons.reducer';
import { GetSectionsByCourseId } from 'src/State/SectionsState/sections.actions';
import { selectAllSections } from 'src/State/SectionsState/sections.reducer';

@Component({
  selector: 'app-show-all-lessons',
  templateUrl: './show-all-lessons.component.html',
  styleUrls: ['./show-all-lessons.component.css']
})
export class ShowAllLessonsComponent implements OnInit
{
  colDefs: ColDefs[] = [
    { field: "name", display: "Name", },
    { field: "section", display: "Section", isObject: true, KeyToShowIfObjectTrue: "name" },
  ];
  resetSelectedRow: boolean = false;
  dataSource: CbTableDataSource<Lesson> = new CbTableDataSource<Lesson>();
  Sections$ = this.store.select(selectAllSections);
  Courses$ = this.store.select(selectAllCourses);
  Lessons$ = this.store.select(selectAllLessons);
  isLoading = true;
  LessonActionType: string = "";
  ActionType = PostType;
  DashboardRoutes = DashboardRoutes;
  AllLessons: Lesson[] = [];
  AllSections: Section[] = [];
  SelectedSectionId: number = 0;
  SelectedCourseId: number = 0;
  selectedLessons: Lesson[] = [];
  LessonToAddOrUpdate: Lesson = new Lesson();
  SelectedLesson: Lesson = new Lesson();
  SectionActionType: string = '';
  SectionToAddOrUpdate: Section = new Section();
  SectionsOfSelectedCourse: Section[] = [];

  constructor(private store: Store, private title: Title,
    private spinner: SpinnerService,
    private treeDataStructure: TreeDataStructureService<Section>,
    private router: Router)
  {
    this.title.setTitle("Lessons");
  }

  ngOnInit(): void
  {
    this.store.dispatch(LoadCourses());
    this.Sections$.subscribe(Sections =>
    {
      this.isLoading = false;
      this.AllSections = Sections;
      let temp = this.AllSections.filter(Section => Section.courseId == this.SelectedCourseId);
      this.treeDataStructure.setData(temp);
      this.SectionsOfSelectedCourse = this.treeDataStructure.finalFlatenArray();
    });
    this.Lessons$.subscribe(Lessons =>
    {
      this.AllLessons = Lessons;
    });
    this.store.select(Select_Lesson_AdditionState).subscribe(state =>
    {
      if (state)
      {
        this.onCourseChange(this.SelectedCourseId.toString());
        this.store.dispatch(LessonAdditionIsComplete({ status: false }));
      }
    });
    this.store.select(Select_Lesson_UpdateState).subscribe(state =>
    {
      if (state)
      {
        this.onCourseChange(this.SelectedCourseId.toString());
        this.store.dispatch(LessonUpdateIsCompleted({ status: false }));
      }
    });
  }
  SelectLesson(selectedLesson: Lesson)
  {
    this.SelectedLesson = selectedLesson;
  }
  ChangeStatus(status: number)
  {
    let LessonToUpdate = { ...this.SelectedLesson };
    LessonToUpdate.status = status;
    this.store.dispatch(ChangeStatus(LessonToUpdate));
    this.store.select(selectLessonsByID(this.SelectedLesson.id)).subscribe(Section =>
    {
      if (Section)
        this.SelectLesson(Section);
    });
  }

  onCourseChange(CourseId: string)
  {
    this.spinner.fullScreenSpinner();
    let courseId = Number(CourseId);
    if (courseId > 0)
    {
      this.store.dispatch(GetSectionsByCourseId({ courseId: courseId }));
      let temp = this.AllSections.filter(Section => Section.courseId == this.SelectedCourseId);
      this.treeDataStructure.setData(temp);
      this.SectionsOfSelectedCourse = this.treeDataStructure.finalFlatenArray();
    }
    this.SelectedSectionId = 0;
  }

  AddNewLesson(event: boolean)
  {
    if (event)
    {
      this.router.navigate(["", DashboardRoutes.Home, DashboardRoutes.Courses.Home,
        DashboardRoutes.Courses.Lessons.Home,
        DashboardRoutes.Courses.Lessons.AddLesson]);
    }
  }
  EditLesson(lesson: Lesson)
  {
    if (lesson)
    {
      this.router.navigate(["", DashboardRoutes.Home, DashboardRoutes.Courses.Home,
        DashboardRoutes.Courses.Lessons.Home,
        DashboardRoutes.Courses.Lessons.EditLesson], { queryParams: { id: lesson.id } });
    }
  }
  DeleteLesson(lesson: Lesson)
  {
    if (lesson)
    {
      this.store.dispatch(RemoveLesson({ id: lesson.id, url: DashboardRoutes.Courses.Lessons.EditLesson }));
    }
  }
  onSectionChange(SectionId: string)
  {
    let sectionId = Number(SectionId);
    if (sectionId > 0)
    {
      this.store.dispatch(GetLessonsByCourseId({ courseId: this.SelectedCourseId, sectionId: this.SelectedSectionId }));

      this.selectedLessons = this.AllLessons.filter(Section => Section.courseId == this.SelectedCourseId &&
        Section.sectionId == sectionId);
      this.SectionToAddOrUpdate = this.SectionsOfSelectedCourse.filter(s => s.id === sectionId)[0];
    }
  }
}
