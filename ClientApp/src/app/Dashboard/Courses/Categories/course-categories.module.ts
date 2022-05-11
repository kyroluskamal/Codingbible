import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CourseCategoriesRoutingModule } from './course-categories-routing.module';
import { CourseCategoryComponent } from './course-category/course-category.component';
import { CourseCategoryHandlerComponent } from './course-category-handler/course-category-handler.component';
import { SharedModule } from 'src/SharedModules/shared.module';
import { ShareComponentsforDashboardModule } from 'src/SharedModules/share-componentsfor-dashboard.module';


@NgModule({
  declarations: [CourseCategoryComponent, CourseCategoryHandlerComponent],
  imports: [
    CommonModule, SharedModule, ShareComponentsforDashboardModule,
    CourseCategoriesRoutingModule
  ]
})
export class CourseCategoriesModule { }
