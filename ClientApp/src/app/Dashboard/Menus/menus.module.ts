import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenusComponent } from './menus/menus.component';
import { MenusRoutingModule } from './menus-routing.module';



@NgModule({
  declarations: [
    MenusComponent
  ],
  imports: [
    CommonModule, MenusRoutingModule
  ]
})
export class MenusModule { }
