import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CoursesHomeRoutingModule } from './courses-home-routing.module';
import { CoursesHomeComponent } from './courses-home/courses-home.component';
import { SharedModuleForHomeModule } from 'src/SharedModules/shared-module-for-home.module';
import { SharedPipesModule } from 'src/SharedModules/shared-pipes.module';


@NgModule({
  declarations: [
    CoursesHomeComponent
  ],
  imports: [
    CommonModule, SharedModuleForHomeModule,
    CoursesHomeRoutingModule, SharedPipesModule,
  ]
})
export class CoursesHomeModule { }
