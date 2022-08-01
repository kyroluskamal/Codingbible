import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenusComponent } from './menus/menus.component';
import { MenusRoutingModule } from './menus-routing.module';
import { ShareComponentsforDashboardModule } from 'src/SharedModules/share-componentsfor-dashboard.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ImageUrlForScreen } from 'src/Pipes/ImageUrlForScreen.pipe';


@NgModule({
  declarations: [
    MenusComponent
  ],
  imports: [
    CommonModule, MenusRoutingModule, ShareComponentsforDashboardModule, ReactiveFormsModule,
    FormsModule
  ]
})
export class MenusModule { }
