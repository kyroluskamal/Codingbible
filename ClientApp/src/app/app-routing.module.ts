import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardRoutes, NOT_READY } from 'src/Helpers/router-constants';
import { AuthGuard } from 'src/guards/auth.guard';
export const routes: Routes = [
  {
    path: "", loadChildren: () => import('./HomeWebsite/home-website.module').then(m => m.HomeWebsiteModule),
    data: { breadcrumb: 'Home' }
  },
  { path: DashboardRoutes.Home, loadChildren: () => import('./Dashboard/dashboard.module').then(m => m.DashboardModule), canActivate: [AuthGuard] },
  { path: "account", loadChildren: () => import('./HomeWebsite/auth-module/auth-module.module').then(m => m.AuthModuleModule) },
  { path: 'ar', loadChildren: () => import('./arabic/arabic.module').then(m => m.ArabicModule) },
  {
    path: "**", async loadComponent()
    {
      const m = await import('./CommonComponents/not-found/not-found.component');
      return m.NotFoundComponent;
    },
  }
];


@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes/*, { enableTracing: true }*/)],
  exports: [RouterModule]

})
export class AppRoutingModule { }
