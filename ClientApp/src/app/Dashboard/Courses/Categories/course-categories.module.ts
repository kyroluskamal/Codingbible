import { NgModule } from '@angular/core';
import { CourseCategoriesRoutingModule } from './course-categories-routing.module';
import { CourseCategoryComponent } from './course-category/course-category.component';
import { SharedModuleForCoursesModule } from '../shared-module-for-courses/shared-module-for-courses.module';


@NgModule({
  declarations: [CourseCategoryComponent],
  imports: [
    SharedModuleForCoursesModule,
    CourseCategoriesRoutingModule,
  ],
  exports: [CourseCategoryComponent]
})
export class CourseCategoriesModule { }
