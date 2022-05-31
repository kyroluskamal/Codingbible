import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardRoutes } from 'src/Helpers/router-constants';
import { CourseWizardComponent } from './course-wizard/course-wizard.component';
import { LessonHandlerComponent } from './lesson-handler/lesson-handler.component';
import { ShowAllCoursesComponent } from './show-all-courses/show-all-courses.component';
import { ShowAllLessonsComponent } from './show-all-lessons/show-all-lessons.component';
import { ShowAllSectionsComponent } from './show-all-sections/show-all-sections.component';

const CourseRoutes: Routes = [
  {
    path: '', component: ShowAllCoursesComponent
  },
  {
    path: DashboardRoutes.Courses.Categories,
    loadChildren: () => import('./Categories/course-categories.module').then(m => m.CourseCategoriesModule)
  },
  { path: DashboardRoutes.Courses.Sections, component: ShowAllSectionsComponent },
  { path: DashboardRoutes.Courses.Wizard, component: CourseWizardComponent },
  { path: DashboardRoutes.Courses.Wizard, component: CourseWizardComponent },
  {
    path: DashboardRoutes.Courses.Lessons.Home,
    children: [
      { path: '', component: ShowAllLessonsComponent },
      { path: DashboardRoutes.Courses.Lessons.AddLesson, component: LessonHandlerComponent },
      { path: DashboardRoutes.Courses.Lessons.EditLesson, component: LessonHandlerComponent },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(CourseRoutes)],
  exports: [RouterModule]
})
export class CourseRoutingModule { }
