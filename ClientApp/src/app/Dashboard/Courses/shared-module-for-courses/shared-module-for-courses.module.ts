import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CourseCategoryHandlerComponent } from '../Categories/course-category-handler/course-category-handler.component';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { SharedModule } from 'src/SharedModules/shared.module';
import { ShareComponentsforDashboardModule } from 'src/SharedModules/share-componentsfor-dashboard.module';
import { SectionModalComponent } from '../Categories/section-modal/section-modal.component';



@NgModule({
  declarations: [CourseCategoryHandlerComponent, SectionModalComponent],
  imports: [
    SharedModule, TooltipModule, ShareComponentsforDashboardModule,
  ], exports: [SectionModalComponent, CourseCategoryHandlerComponent,
    SharedModule, ShareComponentsforDashboardModule, TooltipModule]
})
export class SharedModuleForCoursesModule { }
