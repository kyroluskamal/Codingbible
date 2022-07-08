import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ShowCourseRoutingModule } from './show-course-routing.module';
import { ShowCourseContentComponent } from './show-course/show-course-content.component';
import { SharedModuleForHomeModule } from 'src/SharedModules/shared-module-for-home.module';
import { SharedPipesModule } from 'src/SharedModules/shared-pipes.module';
import { PlayListModule } from 'src/SharedModules/play-list/play-list.module';


@NgModule({
  declarations: [
    ShowCourseContentComponent
  ],
  imports: [
    CommonModule, PlayListModule,
    ShowCourseRoutingModule, SharedModuleForHomeModule, SharedPipesModule,
  ]
})
export class ShowCourseModule { }
