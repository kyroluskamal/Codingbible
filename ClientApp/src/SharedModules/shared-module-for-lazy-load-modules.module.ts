import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BreadcrumbModule } from 'xng-breadcrumb';



@NgModule({
  declarations: [],
  imports: [
    BreadcrumbModule
  ],
  exports: [BreadcrumbModule, CommonModule]
})
export class SharedModuleForLazyLoadModulesModule { }
