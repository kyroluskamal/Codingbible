import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from './CommonComponents/not-found/not-found.component';
import { DashboardRoutes } from 'src/Helpers/router-constants';
import { AuthGuard } from 'src/guards/auth.guard';
import { HomeComponent } from './HomeWebsite/home/home.component';
export const routes: Routes = [
  {
    path: "", loadChildren: () => import('./HomeWebsite/home-website.module').then(m => m.HomeWebsiteModule),
    data: { breadcrumb: 'Home' }
  },
  { path: DashboardRoutes.Home, loadChildren: () => import('./Dashboard/dashboard.module').then(m => m.DashboardModule), canActivate: [AuthGuard] },
  { path: "account", loadChildren: () => import('./HomeWebsite/auth-module/auth-module.module').then(m => m.AuthModuleModule) },
  { path: 'ar', loadChildren: () => import('./arabic/arabic.module').then(m => m.ArabicModule) },
  { path: "**", component: NotFoundComponent }
];


@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes/*, { enableTracing: true }*/)],
  exports: [RouterModule]

})
export class AppRoutingModule { }
