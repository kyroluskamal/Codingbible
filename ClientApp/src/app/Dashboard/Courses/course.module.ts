import { NgModule } from '@angular/core';
import { CourseRoutingModule } from './course-routing.module';
import { ShowAllCoursesComponent } from './show-all-courses/show-all-courses.component';
import { CourseWizardComponent } from './course-wizard/course-wizard.component';
import { SharedModuleForCoursesModule } from './shared-module-for-courses/shared-module-for-courses.module';
import { ShowAllSectionsComponent } from './show-all-sections/show-all-sections.component';

@NgModule({
  declarations: [
    ShowAllCoursesComponent,
    CourseWizardComponent,
    ShowAllSectionsComponent,
  ],
  imports: [
    CourseRoutingModule, SharedModuleForCoursesModule
  ]
})
export class CourseModule { }
