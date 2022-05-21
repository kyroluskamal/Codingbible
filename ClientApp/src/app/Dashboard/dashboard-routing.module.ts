import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/guards/auth.guard';
import { DashboardRoutes } from '../../Helpers/router-constants';
import { DashboardHomeComponent } from './dashboard-home/dashboard-home.component';


export const DashBoardRoutesModule: Routes = [
  {
    path: '', component: DashboardHomeComponent, children: [
      {
        path: DashboardRoutes.Courses.Home,
        loadChildren: () => import('./Courses/course.module').then(m => m.CourseModule)
      },
      {
        path: DashboardRoutes.Posts.Home,
        loadChildren: () => import('./PostsInDashboard/posts-in-dashboard.module').then(m => m.PostsInDashboardModule)
      },
      {
        path: DashboardRoutes.Appereance.Menus,
        loadChildren: () => import('./Menus/menus.module').then(m => m.MenusModule)
      }
    ], canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(DashBoardRoutesModule)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
