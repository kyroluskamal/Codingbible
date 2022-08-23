import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShowCourseRoutingModule } from './show-course-routing.module';
import { ShowCourseContentComponent } from './show-course/show-course-content.component';
import { SharedModuleForHomeModule } from 'src/SharedModules/shared-module-for-home.module';
import { PlayListModule } from 'src/SharedModules/play-list/play-list.module';
import { TranslatePipe } from 'src/Pipes/translate.pipe';
import { PageTitleComponent } from 'src/SharedModules/page-title/page-title.component';
import { IntroductoyVideoComponent } from 'src/SharedModules/introductoy-video/introductoy-video.component';
import { DescriptionComponent } from 'src/SharedModules/description/description.component';
import { PageTitlePlaceHolderComponent } from 'src/SharedModules/page-title-place-holder/page-title-place-holder.component';
import { NotFoundBoxComponent } from 'src/SharedModules/not-found-box/not-found-box.component';
import { CourseTextToListComponent } from 'src/SharedModules/course-text-to-list/course-text-to-list.component';


@NgModule({
  declarations: [
    ShowCourseContentComponent
  ],
  imports: [
    CommonModule, PlayListModule, IntroductoyVideoComponent, DescriptionComponent, CourseTextToListComponent,
    PageTitlePlaceHolderComponent, ShowCourseRoutingModule, SharedModuleForHomeModule, TranslatePipe, PageTitleComponent,
    NotFoundBoxComponent
  ]
})
export class ShowCourseModule { }
