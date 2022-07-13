import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ShowSectionRoutingModule } from './show-section-routing.module';
import { AllSectionsHomeComponent } from './all-sections-home/all-sections-home.component';
import { ShowSectionConctentComponent } from './show-section-conctent/show-section-conctent.component';
import { SharedModuleForHomeModule } from 'src/SharedModules/shared-module-for-home.module';
import { PageTitleComponent } from 'src/SharedModules/page-title/page-title.component';
import { PageTitlePlaceHolderComponent } from 'src/SharedModules/page-title-place-holder/page-title-place-holder.component';
import { IntroductoyVideoComponent } from 'src/SharedModules/introductoy-video/introductoy-video.component';
import { WhatWillYouLearnComponent } from 'src/SharedModules/what-will-you-learn/what-will-you-learn.component';
import { TranslatePipe } from 'src/Pipes/translate.pipe';
import { PlayListModule } from 'src/SharedModules/play-list/play-list.module';
import { NotFoundBoxComponent } from 'src/SharedModules/not-found-box/not-found-box.component';
import { ShowAllLessonsOrSectionsComponent } from 'src/SharedModules/show-all-lessons-or-sections/show-all-lessons-or-sections.component';


@NgModule({
  declarations: [
    AllSectionsHomeComponent,
    ShowSectionConctentComponent
  ],
  imports: [
    CommonModule, SharedModuleForHomeModule, PageTitleComponent, PageTitlePlaceHolderComponent,
    ShowSectionRoutingModule, IntroductoyVideoComponent, WhatWillYouLearnComponent,
    TranslatePipe, PlayListModule, NotFoundBoxComponent, ShowAllLessonsOrSectionsComponent
  ]
})
export class ShowSectionModule { }
