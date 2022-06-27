import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShowCourseComponent } from './show-course/show-course.component';

const routes: Routes = [
  { path: '', component: ShowCourseComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShowCourseRoutingModule { }
