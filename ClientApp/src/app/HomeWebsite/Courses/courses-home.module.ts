import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CoursesHomeRoutingModule } from './courses-home-routing.module';
import { CoursesHomeComponent } from './courses-home/courses-home.component';
import { SharedModuleForHomeModule } from 'src/SharedModules/shared-module-for-home.module';


@NgModule({
  declarations: [
    CoursesHomeComponent
  ],
  imports: [
    CommonModule, SharedModuleForHomeModule,
    CoursesHomeRoutingModule
  ]
})
export class CoursesHomeModule { }
