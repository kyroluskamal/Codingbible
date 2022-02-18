import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { CommonComponentsModule } from '../CommonComponents/common-components.module';
import { MaterialModule } from '../SharedModules/material.module';
import { SharedModule } from '../SharedModules/shared.module';
import { DashboardHomeComponent } from './dashboard-home/dashboard-home.component';

const components = [
  DashboardHomeComponent
];
@NgModule({
  declarations: [components],
  imports: [
    CommonModule, MaterialModule, SharedModule,
    DashboardRoutingModule,
    CommonComponentsModule
  ],
  exports: [components]
})
export class DashboardModule { }
