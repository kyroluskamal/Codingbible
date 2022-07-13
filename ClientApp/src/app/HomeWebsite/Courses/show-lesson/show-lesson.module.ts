import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ShowLessonRoutingModule } from './show-lesson-routing.module';
import { AllLessonsHomeComponent } from './all-lessons-home/all-lessons-home.component';
import { ShowLessonContentComponent } from './show-lesson-content/show-lesson-content.component';
import { SharedModuleForHomeModule } from 'src/SharedModules/shared-module-for-home.module';
import { PageTitleComponent } from 'src/SharedModules/page-title/page-title.component';
import { PageTitlePlaceHolderComponent } from 'src/SharedModules/page-title-place-holder/page-title-place-holder.component';
import { BypassStylePipe } from 'src/Pipes/bypass-style.pipe';
import { VideoContainerComponent } from 'src/SharedModules/video-container/video-container.component';
import { TranslatePipe } from 'src/Pipes/translate.pipe';
import { NotFoundBoxComponent } from 'src/SharedModules/not-found-box/not-found-box.component';
import { ShowAllLessonsOrSectionsComponent } from 'src/SharedModules/show-all-lessons-or-sections/show-all-lessons-or-sections.component';


@NgModule({
  declarations: [
    AllLessonsHomeComponent,
    ShowLessonContentComponent,
  ],
  imports: [
    CommonModule, SharedModuleForHomeModule, PageTitleComponent, PageTitlePlaceHolderComponent,
    ShowLessonRoutingModule, BypassStylePipe, VideoContainerComponent, TranslatePipe,
    NotFoundBoxComponent, ShowAllLessonsOrSectionsComponent
  ]
})
export class ShowLessonModule { }
