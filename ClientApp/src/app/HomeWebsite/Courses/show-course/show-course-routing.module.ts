import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShowCourseContentComponent } from './show-course/show-course-content.component';

const routes: Routes = [
  {
    path: '', component: ShowCourseContentComponent, data: {
      breadcrumb: {
        alias: 'courseSlug'
      }
    }
  },
  { path: 'section', loadChildren: () => import('../show-section/show-section.module').then(m => m.ShowSectionModule) },
  { path: 'lesson', loadChildren: () => import('../show-lesson/show-lesson.module').then(m => m.ShowLessonModule) }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShowCourseRoutingModule { }
