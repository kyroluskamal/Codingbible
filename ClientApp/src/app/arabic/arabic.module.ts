import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ArabicRoutingModule } from './arabic-routing.module';
import { ArabicHomeComponent } from './arabic-home/arabic-home.component';
import { SharedModuleForHomeModule } from 'src/SharedModules/shared-module-for-home.module';


@NgModule({
  declarations: [
    ArabicHomeComponent
  ],
  imports: [
    SharedModuleForHomeModule,
    ArabicRoutingModule
  ]
})
export class ArabicModule { }
