import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoriesRoutingModule } from './categories-routing.module';
import { AddGategoryComponent } from './add-gategory/add-gategory.component';
import { UpdateGategoryComponent } from './update-gategory/update-gategory.component';
import { GategoryHomeComponent } from './gategory-home/gategory-home.component';
import { AddEditCategoriesComponent } from './add-edit-categories/add-edit-categories.component';
import { ShareComponentsforDashboardModule } from 'src/SharedModules/share-componentsfor-dashboard.module';


@NgModule({
  declarations: [
    AddGategoryComponent,
    UpdateGategoryComponent,
    GategoryHomeComponent,
    AddEditCategoriesComponent,
  ],
  imports: [
    CommonModule,
    CategoriesRoutingModule,
    ShareComponentsforDashboardModule
  ]
})
export class CategoriesModule { }
