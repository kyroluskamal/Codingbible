import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from './CommonComponents/not-found/not-found.component';
import { DashboardRoutes, HomeRoutes } from 'src/Helpers/router-constants';
import { AuthGuard } from 'src/guards/auth.guard';
import { HomeComponent } from './HomeWebsite/home/home.component';
const routes: Routes = [
  { path: "", component: HomeComponent, pathMatch: "full" },
  { path: HomeRoutes.Home.toLowerCase(), component: HomeComponent },
  { path: DashboardRoutes.Home, loadChildren: () => import('./Dashboard/dashboard.module').then(m => m.DashboardModule), canActivate: [AuthGuard] },
  { path: "account", loadChildren: () => import('./HomeWebsite/home-website.module').then(m => m.HomeWebsiteModule) },
  { path: "**", component: NotFoundComponent }
];




@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes/*, { enableTracing: true }*/)],
  exports: [RouterModule]

})
export class AppRoutingModule { }
