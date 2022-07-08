import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenusComponent } from './menus/menus.component';
import { MenusRoutingModule } from './menus-routing.module';
import { ShareComponentsforDashboardModule } from 'src/SharedModules/share-componentsfor-dashboard.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedPipesModule } from 'src/SharedModules/shared-pipes.module';



@NgModule({
  declarations: [
    MenusComponent
  ],
  imports: [
    CommonModule, MenusRoutingModule, ShareComponentsforDashboardModule, ReactiveFormsModule,
    FormsModule, SharedPipesModule
  ]
})
export class MenusModule { }
