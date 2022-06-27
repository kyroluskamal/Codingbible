import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CourseCategoriesHomeComponent } from './course-categories-home/course-categories-home.component';

const routes: Routes = [
  { path: '', component: CourseCategoriesHomeComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CourseCategoriesRoutingModule { }
