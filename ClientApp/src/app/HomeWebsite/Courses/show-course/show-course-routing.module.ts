import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeRoutes } from 'src/Helpers/router-constants';
import { ShowCourseContentComponent } from './show-course/show-course-content.component';

const routes: Routes = [
  {
    path: '', component: ShowCourseContentComponent, data: {
      breadcrumb: {
        alias: 'courseSlug'
      }
    }
  },
  { path: HomeRoutes.Courses.Section, loadChildren: () => import('../show-section/show-section.module').then(m => m.ShowSectionModule) },
  {
    path: HomeRoutes.Courses.Lesson, loadChildren: () => import('../show-lesson/show-lesson.module').then(m => m.ShowLessonModule),
    data: {
      breadcrumb: {
        alias: 'lessonHome',
      }
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShowCourseRoutingModule { }
