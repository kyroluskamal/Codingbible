import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CourseRoutingModule } from './course-routing.module';
import { ShowAllCoursesComponent } from './show-all-courses/show-all-courses.component';
import { ShareComponentsforDashboardModule } from 'src/SharedModules/share-componentsfor-dashboard.module';
import { SharedModule } from 'src/SharedModules/shared.module';


@NgModule({
  declarations: [
    ShowAllCoursesComponent,
  ],
  imports: [
    CommonModule, ShareComponentsforDashboardModule,
    CourseRoutingModule, SharedModule
  ]
})
export class CourseModule { }
