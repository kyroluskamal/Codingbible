import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from './CommonComponents/not-found/not-found.component';
import { DashboardRoutes } from 'src/Helpers/router-constants';
import { AuthGuard } from 'src/guards/auth.guard';
const routes: Routes = [
  { path: DashboardRoutes.Home, loadChildren: () => import('./Dashboard/dashboard.module').then(m => m.DashboardModule), canActivate: [AuthGuard] },
  { path: "**", component: NotFoundComponent }
];




@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes/*, { enableTracing: true }*/)],
  exports: [RouterModule]

})
export class AppRoutingModule { }
