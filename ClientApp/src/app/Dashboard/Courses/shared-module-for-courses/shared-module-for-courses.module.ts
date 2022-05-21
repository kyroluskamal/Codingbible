import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CourseCategoryHandlerComponent } from '../Categories/course-category-handler/course-category-handler.component';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { SharedModule } from 'src/SharedModules/shared.module';
import { ShareComponentsforDashboardModule } from 'src/SharedModules/share-componentsfor-dashboard.module';



@NgModule({
  declarations: [CourseCategoryHandlerComponent],
  imports: [
    CommonModule, SharedModule, TooltipModule, ShareComponentsforDashboardModule,
  ], exports: [CommonModule, CourseCategoryHandlerComponent, SharedModule, ShareComponentsforDashboardModule, TooltipModule]
})
export class SharedModuleForCoursesModule { }
