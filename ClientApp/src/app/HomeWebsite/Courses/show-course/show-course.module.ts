import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ShowCourseRoutingModule } from './show-course-routing.module';
import { ShowCourseComponent } from './show-course/show-course.component';


@NgModule({
  declarations: [
    ShowCourseComponent
  ],
  imports: [
    CommonModule,
    ShowCourseRoutingModule
  ]
})
export class ShowCourseModule { }
