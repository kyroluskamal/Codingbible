import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CourseCategoriesRoutingModule } from './course-categories-routing.module';
import { CourseCategoriesHomeComponent } from './course-categories-home/course-categories-home.component';


@NgModule({
  declarations: [
    CourseCategoriesHomeComponent
  ],
  imports: [
    CommonModule,
    CourseCategoriesRoutingModule
  ]
})
export class CourseCategoriesModule { }
