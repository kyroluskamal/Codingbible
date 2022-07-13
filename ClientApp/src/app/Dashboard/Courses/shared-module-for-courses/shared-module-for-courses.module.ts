import { NgModule } from '@angular/core';
import { CourseCategoryHandlerComponent } from '../Categories/course-category-handler/course-category-handler.component';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { SharedModule } from 'src/SharedModules/shared.module';
import { ShareComponentsforDashboardModule } from 'src/SharedModules/share-componentsfor-dashboard.module';
import { SectionModalComponent } from '../section-modal/section-modal.component';
import { SectionChildComponent } from '../section-child/section-child.component';
import { ShowAllLessonsComponent } from '../show-all-lessons/show-all-lessons.component';
import { LessonHandlerComponent } from '../lesson-handler/lesson-handler.component';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { RouterModule } from '@angular/router';
import { LessonForPlannerModalComponent } from '../lesson-for-planner-modal/lesson-for-planner-modal.component';
import { SafeUrlPipe } from 'src/Pipes/safe-url.pipe';
import { BypassStylePipe } from 'src/Pipes/bypass-style.pipe';



@NgModule({
  declarations: [CourseCategoryHandlerComponent, SectionModalComponent,
    LessonHandlerComponent, SectionChildComponent, LessonForPlannerModalComponent,
    ShowAllLessonsComponent],
  imports: [RouterModule, SafeUrlPipe,
    SharedModule, TooltipModule, ShareComponentsforDashboardModule, TabsModule, BypassStylePipe,
  ], exports: [SectionModalComponent, CourseCategoryHandlerComponent, LessonHandlerComponent, ShowAllLessonsComponent,
    SharedModule, ShareComponentsforDashboardModule, TooltipModule, LessonForPlannerModalComponent,
    SectionChildComponent]
})
export class SharedModuleForCoursesModule { }
