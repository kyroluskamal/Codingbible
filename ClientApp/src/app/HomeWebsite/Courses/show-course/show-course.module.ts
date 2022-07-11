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
import { WhatWillYouLearnComponent } from 'src/SharedModules/what-will-you-learn/what-will-you-learn.component';
import { TargetAudienceComponent } from 'src/SharedModules/target-audience/target-audience.component';
import { RequirementsOrInstructionsComponent } from 'src/SharedModules/requirements-or-instructions/requirements-or-instructions.component';
import { CourseFeaturesComponent } from 'src/SharedModules/course-features/course-features.component';
import { PageTitlePlaceHolderComponent } from 'src/SharedModules/page-title-place-holder/page-title-place-holder.component';


@NgModule({
  declarations: [
    ShowCourseContentComponent
  ],
  imports: [
    CommonModule, PlayListModule, IntroductoyVideoComponent, DescriptionComponent,
    CourseFeaturesComponent, PageTitlePlaceHolderComponent, WhatWillYouLearnComponent, TargetAudienceComponent, RequirementsOrInstructionsComponent,
    ShowCourseRoutingModule, SharedModuleForHomeModule, TranslatePipe, PageTitleComponent
  ]
})
export class ShowCourseModule { }
