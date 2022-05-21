import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CourseRoutingModule } from './course-routing.module';
import { ShowAllCoursesComponent } from './show-all-courses/show-all-courses.component';
import { ShareComponentsforDashboardModule } from 'src/SharedModules/share-componentsfor-dashboard.module';
import { SharedModule } from 'src/SharedModules/shared.module';
import { CourseWizardComponent } from './course-wizard/course-wizard.component';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { CourseCategoriesModule } from './Categories/course-categories.module';
import { SharedModuleForCoursesModule } from './shared-module-for-courses/shared-module-for-courses.module';


@NgModule({
  declarations: [
    ShowAllCoursesComponent,
    CourseWizardComponent,
  ],
  imports: [
    CourseRoutingModule, SharedModuleForCoursesModule
  ]
})
export class CourseModule { }
