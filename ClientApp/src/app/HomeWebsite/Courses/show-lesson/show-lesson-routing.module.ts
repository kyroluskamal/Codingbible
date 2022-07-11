import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllLessonsHomeComponent } from './all-lessons-home/all-lessons-home.component';
import { ShowLessonContentComponent } from './show-lesson-content/show-lesson-content.component';

const routes: Routes = [
  {
    path: '', component: AllLessonsHomeComponent

  },
  {
    path: ':slug', component: ShowLessonContentComponent,
    data: {
      breadcrumb: {
        alias: 'lessonSlug',
      }
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShowLessonRoutingModule { }
