import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ShowSectionRoutingModule } from './show-section-routing.module';
import { AllSectionsHomeComponent } from './all-sections-home/all-sections-home.component';
import { ShowSectionConctentComponent } from './show-section-conctent/show-section-conctent.component';


@NgModule({
  declarations: [
    AllSectionsHomeComponent,
    ShowSectionConctentComponent
  ],
  imports: [
    CommonModule,
    ShowSectionRoutingModule
  ]
})
export class ShowSectionModule { }
