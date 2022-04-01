import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/guards/auth.guard';
import { DashboardRoutes } from '../../Helpers/router-constants';
import { DashboardHomeComponent } from './dashboard-home/dashboard-home.component';


export const DashBoardRoutesModule: Routes = [
  {
    path: '', component: DashboardHomeComponent, children: [
      {
        path: DashboardRoutes.Posts.Home,
        loadChildren: () => import('./PostsInDashboard/posts-in-dashboard.module').then(m => m.PostsInDashboardModule)
      }
    ], canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(DashBoardRoutesModule)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
