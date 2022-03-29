import { NgModule } from '@angular/core';
import { HomeNavMenuComponent } from 'src/app/HomeWebsite/home-nav-menu/home-nav-menu.component';

import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

const modules = [
  CommonModule, RouterModule
];
@NgModule({
  imports: [modules],
  declarations: [HomeNavMenuComponent,],
  exports: [HomeNavMenuComponent]
})
export class SharedComponentsModule { }
