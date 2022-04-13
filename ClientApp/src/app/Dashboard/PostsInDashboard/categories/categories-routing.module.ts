import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoryHomeComponent } from './Category-home/category-home.component';

const routes: Routes = [
  { path: "", component: CategoryHomeComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CategoriesRoutingModule { }
