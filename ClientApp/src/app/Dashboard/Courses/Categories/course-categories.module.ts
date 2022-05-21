import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CourseCategoriesRoutingModule } from './course-categories-routing.module';
import { CourseCategoryComponent } from './course-category/course-category.component';
import { SharedModule } from 'src/SharedModules/shared.module';
import { ShareComponentsforDashboardModule } from 'src/SharedModules/share-componentsfor-dashboard.module';
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
