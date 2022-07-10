import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeRoutes } from '../../Helpers/router-constants';

import { HomeComponent } from './home/home.component';

export const RoutesForHomeModule: Routes = [
  { path: "", component: HomeComponent, data: { breadcrumb: 'Home' } },
  { path: HomeRoutes.Courses.Home, loadChildren: () => import('./Courses/courses-home.module').then(m => m.CoursesHomeModule), data: { breadcrumb: 'Courses' } },
];

@NgModule({
  imports: [RouterModule.forChild(RoutesForHomeModule)],
  exports: [RouterModule]
})
export class HomeWebsiteRoutingModule { }
