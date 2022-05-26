import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CourseCategoryHandlerComponent } from '../Categories/course-category-handler/course-category-handler.component';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { SharedModule } from 'src/SharedModules/shared.module';
import { ShareComponentsforDashboardModule } from 'src/SharedModules/share-componentsfor-dashboard.module';
import { SectionModalComponent } from '../section-modal/section-modal.component';
import { SectionChildComponent } from '../section-child/section-child.component';



@NgModule({
  declarations: [CourseCategoryHandlerComponent, SectionModalComponent, SectionChildComponent],
  imports: [
    SharedModule, TooltipModule, ShareComponentsforDashboardModule,
  ], exports: [SectionModalComponent, CourseCategoryHandlerComponent,
    SharedModule, ShareComponentsforDashboardModule, TooltipModule, SectionChildComponent]
})
export class SharedModuleForCoursesModule { }
