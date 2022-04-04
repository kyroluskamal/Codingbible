import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CategoriesRoutingModule } from './categories-routing.module';
import { AddGategoryComponent } from './add-gategory/add-gategory.component';
import { UpdateGategoryComponent } from './update-gategory/update-gategory.component';
import { GetAllGategoryComponent } from './get-all-gategory/get-all-gategory.component';
import { GategoryHomeComponent } from './gategory-home/gategory-home.component';


@NgModule({
  declarations: [
    AddGategoryComponent,
    UpdateGategoryComponent,
    GetAllGategoryComponent,
    GategoryHomeComponent
  ],
  imports: [
    CommonModule,
    CategoriesRoutingModule
  ]
})
export class CategoriesModule { }
