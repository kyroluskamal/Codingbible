import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardRoutes } from '../Helpers/router-constants';
import { NotFoundComponent } from '../CommonComponents/not-found/not-found.component';
import { DashboardHomeComponent } from './dashboard-home/dashboard-home.component';

const routes: Routes = [
  {
    path: DashboardRoutes.Home, component: DashboardHomeComponent, children: [
      { path: '', component: DashboardHomeComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
