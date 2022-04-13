import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoriesRoutingModule } from './categories-routing.module';
import { ShareComponentsforDashboardModule } from 'src/SharedModules/share-componentsfor-dashboard.module';
import { CategoryHandlerComponent } from './category-handler/category-handler.component';
import { CategoryHomeComponent } from './Category-home/category-home.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';


@NgModule({
  declarations: [
    CategoryHandlerComponent,
    CategoryHomeComponent,
  ],
  imports: [
    CommonModule, ReactiveFormsModule, FormsModule,
    CategoriesRoutingModule, MatFormFieldModule, MatSelectModule,
    ShareComponentsforDashboardModule
  ]
})
export class CategoriesModule { }
