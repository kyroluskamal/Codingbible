import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CourseCategoriesHomeComponent } from './course-categories-home/course-categories-home.component';
import { CourseCategoryContentComponent } from './course-category-content/course-category-content.component';

const routes: Routes = [
  {
    path: '', component: CourseCategoriesHomeComponent, data: {
      breadcrumb: {
        label: 'Categories',
        alias: 'courseCategories'
      }
    }
  },
  {
    path: ':slug', component: CourseCategoryContentComponent, data: {
      breadcrumb: {
        alias: 'CourseCatContent'
      }
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CourseCategoriesRoutingModule { }
