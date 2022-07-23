import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CoursesHomeRoutingModule } from './courses-home-routing.module';
import { CoursesHomeComponent } from './courses-home/courses-home.component';
import { SharedModuleForHomeModule } from 'src/SharedModules/shared-module-for-home.module';
import { TranslatePipe } from 'src/Pipes/translate.pipe';
import { PageTitleComponent } from 'src/SharedModules/page-title/page-title.component';
import { CourseCardComponent } from 'src/SharedModules/course-card/course-card.component';
import { CourseCardPalceholderComponent } from 'src/SharedModules/course-card-palceholder/course-card-palceholder.component';


@NgModule({
  declarations: [
    CoursesHomeComponent
  ],
  imports: [
    CommonModule, SharedModuleForHomeModule, CourseCardPalceholderComponent,
    CoursesHomeRoutingModule, TranslatePipe, PageTitleComponent, CourseCardComponent
  ],
  providers: [TranslatePipe]
})
export class CoursesHomeModule { }
