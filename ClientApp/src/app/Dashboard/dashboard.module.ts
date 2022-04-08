import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardHomeComponent } from './dashboard-home/dashboard-home.component';
import { MaterialModule } from '../../SharedModules/material.module';
import { SharedModule } from '../../SharedModules/shared.module';
import { DialogHandlerService } from 'src/CommonServices/dialog-handler.service';
import { LowerCaseUrlSerializer } from 'src/CommonServices/LowerCaseUrlSerializer';
import { UrlSerializer } from '@angular/router';
import { MediaComponent } from './media/media.component';


const components = [
  DashboardHomeComponent
];
@NgModule({
  declarations: [components],
  imports: [
    CommonModule, MaterialModule, SharedModule,
    DashboardRoutingModule,
  ],
  exports: [components]
  ,
  providers: [
    { provide: UrlSerializer, useClass: LowerCaseUrlSerializer },
    DialogHandlerService
  ]
})
export class DashboardModule { }
