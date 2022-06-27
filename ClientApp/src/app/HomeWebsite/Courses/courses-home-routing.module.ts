import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeRoutes } from 'src/Helpers/router-constants';
import { CoursesHomeComponent } from './courses-home/courses-home.component';

const routes: Routes = [
  { path: '', component: CoursesHomeComponent },
  { path: HomeRoutes.Courses.Categories, loadChildren: () => import('../Courses/show-course/course-categories/course-categories.module').then(m => m.CourseCategoriesModule) },
  { path: ':slug', loadChildren: () => import('./show-course/show-course.module').then(m => m.ShowCourseModule) },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoursesHomeRoutingModule { }
