import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CourseCategoriesHomeComponent } from './course-categories-home/course-categories-home.component';
import { CourseCategoryContentComponent } from './course-category-content/course-category-content.component';

const routes: Routes = [
  { path: '', component: CourseCategoriesHomeComponent },
  { path: ':slug', component: CourseCategoryContentComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CourseCategoriesRoutingModule { }
