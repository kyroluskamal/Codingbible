import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeRoutes } from 'src/Helpers/router-constants';
import { ArabicHomeComponent } from './arabic-home/arabic-home.component';

const routes: Routes = [
  { path: '', component: ArabicHomeComponent },
  { path: HomeRoutes.Courses.Home, loadChildren: () => import('../HomeWebsite/Courses/courses-home.module').then(m => m.CoursesHomeModule) },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ArabicRoutingModule { }
