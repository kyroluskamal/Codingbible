import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CoursesHomeRoutingModule } from './courses-home-routing.module';
import { CoursesHomeComponent } from './courses-home/courses-home.component';


@NgModule({
  declarations: [
    CoursesHomeComponent
  ],
  imports: [
    CommonModule,
    CoursesHomeRoutingModule
  ]
})
export class CoursesHomeModule { }
