import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardRoutes } from 'src/Helpers/router-constants';
import { CourseCategoryComponent } from './Categories/course-category/course-category.component';
import { CourseWizardComponent } from './course-wizard/course-wizard.component';
import { ShowAllCoursesComponent } from './show-all-courses/show-all-courses.component';

const CourseRoutes: Routes = [
  {
    path: '', component: ShowAllCoursesComponent
  },
  {
    path: DashboardRoutes.Courses.Categories,
    loadChildren: () => import('./Categories/course-categories.module').then(m => m.CourseCategoriesModule)
  },
  { path: DashboardRoutes.Courses.Wizard, component: CourseWizardComponent },
];

@NgModule({
  imports: [RouterModule.forChild(CourseRoutes)],
  exports: [RouterModule]
})
export class CourseRoutingModule { }
