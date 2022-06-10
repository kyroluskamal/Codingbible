import { NgModule } from '@angular/core';
import { HomeNavMenuComponent } from 'src/app/HomeWebsite/home-nav-menu/home-nav-menu.component';

import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

const modules = [
  CommonModule, RouterModule
];
@NgModule({
  imports: [modules, TranslateModule],
  declarations: [HomeNavMenuComponent,],
  exports: [HomeNavMenuComponent]
})
export class SharedComponentsModule { }
