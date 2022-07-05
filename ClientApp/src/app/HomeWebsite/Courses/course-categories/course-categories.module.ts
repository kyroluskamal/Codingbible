import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CourseCategoriesRoutingModule } from './course-categories-routing.module';
import { CourseCategoriesHomeComponent } from './course-categories-home/course-categories-home.component';
import { CourseCategoryContentComponent } from './course-category-content/course-category-content.component';


@NgModule({
  declarations: [
    CourseCategoriesHomeComponent,
    CourseCategoryContentComponent
  ],
  imports: [
    CommonModule,
    CourseCategoriesRoutingModule
  ]
})
export class CourseCategoriesModule { }
