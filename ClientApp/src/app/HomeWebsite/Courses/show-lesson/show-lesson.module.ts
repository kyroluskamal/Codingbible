import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ShowLessonRoutingModule } from './show-lesson-routing.module';
import { AllLessonsHomeComponent } from './all-lessons-home/all-lessons-home.component';
import { ShowLessonContentComponent } from './show-lesson-content/show-lesson-content.component';


@NgModule({
  declarations: [
    AllLessonsHomeComponent,
    ShowLessonContentComponent
  ],
  imports: [
    CommonModule,
    ShowLessonRoutingModule
  ]
})
export class ShowLessonModule { }
