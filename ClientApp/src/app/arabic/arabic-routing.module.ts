import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeRoutes, NOT_READY } from 'src/Helpers/router-constants';
import { ArabicHomeComponent } from './arabic-home/arabic-home.component';

const routes: Routes = [
  { path: '', component: ArabicHomeComponent, title: 'الرئيسية' },
  {
    path: HomeRoutes.Courses.Home, loadChildren: () => import('../HomeWebsite/Courses/courses-home.module').then(m => m.CoursesHomeModule),
    data: { breadcrumb: 'الدورات' },
  },
  {
    path: NOT_READY, async loadComponent()
    {
      const m = await import('../HomeWebsite/translation-not-ready/translation-not-ready.component');
      return m.TranslationNotReadyComponent;
    },
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ArabicRoutingModule { }
