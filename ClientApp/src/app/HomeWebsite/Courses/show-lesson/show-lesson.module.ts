import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ShowLessonRoutingModule } from './show-lesson-routing.module';
import { AllLessonsHomeComponent } from './all-lessons-home/all-lessons-home.component';
import { ShowLessonContentComponent } from './show-lesson-content/show-lesson-content.component';
import { SharedModuleForHomeModule } from 'src/SharedModules/shared-module-for-home.module';
import { PageTitleComponent } from 'src/SharedModules/page-title/page-title.component';
import { PageTitlePlaceHolderComponent } from 'src/SharedModules/page-title-place-holder/page-title-place-holder.component';


@NgModule({
  declarations: [
    AllLessonsHomeComponent,
    ShowLessonContentComponent
  ],
  imports: [
    CommonModule, SharedModuleForHomeModule, PageTitleComponent, PageTitlePlaceHolderComponent,
    ShowLessonRoutingModule
  ]
})
export class ShowLessonModule { }
