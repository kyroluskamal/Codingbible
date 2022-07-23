import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeRoutes, NOT_READY } from '../../Helpers/router-constants';

import { HomeComponent } from './home/home.component';

export const RoutesForHomeModule: Routes = [
  {
    path: "", component: HomeComponent, data: {
      breadcrumb: 'Home'
    }, title: 'Home'
  },
  { path: HomeRoutes.Courses.Home, loadChildren: () => import('./Courses/courses-home.module').then(m => m.CoursesHomeModule), data: { breadcrumb: 'Courses' } },
  {
    path: NOT_READY, async loadComponent()
    {
      const m = await import('./translation-not-ready/translation-not-ready.component');
      return m.TranslationNotReadyComponent;
    },
  }
];

@NgModule({
  imports: [RouterModule.forChild(RoutesForHomeModule)],
  exports: [RouterModule]
})
export class HomeWebsiteRoutingModule { }
