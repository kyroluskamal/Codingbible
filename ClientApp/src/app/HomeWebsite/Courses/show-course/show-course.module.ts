import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ShowCourseRoutingModule } from './show-course-routing.module';
import { ShowCourseContentComponent } from './show-course/show-course-content.component';
import { SharedModuleForHomeModule } from 'src/SharedModules/shared-module-for-home.module';


@NgModule({
  declarations: [
    ShowCourseContentComponent
  ],
  imports: [
    CommonModule,
    ShowCourseRoutingModule, SharedModuleForHomeModule
  ]
})
export class ShowCourseModule { }
