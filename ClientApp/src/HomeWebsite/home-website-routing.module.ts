import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PreventLoadIfLoggedInGuard } from 'src/guards/prevent-load-if-logged-in.guard';
import { AuthRoutes, HomeRoutes } from '../Helpers/router-constants';
import { EmailConfirmationComponent } from './AuthComonents/email-confirmation/email-confirmation.component';
import { ResetPasswordComponent } from './AuthComonents/reset-password/reset-password.component';

import { HomeComponent } from './home/home.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { RegisterPageComponent } from './register-page/register-page.component';

const routes: Routes = [
  { path: "", component: HomeComponent, pathMatch: "full" },
  { path: HomeRoutes.Home, component: HomeComponent },
  { path: AuthRoutes.Login, component: LoginPageComponent, canActivate: [PreventLoadIfLoggedInGuard] },
  { path: AuthRoutes.Register, component: RegisterPageComponent, canActivate: [PreventLoadIfLoggedInGuard] },
  { path: AuthRoutes.ResetPassword, component: ResetPasswordComponent, canActivate: [PreventLoadIfLoggedInGuard] },
  { path: AuthRoutes.emailConfirmation, component: EmailConfirmationComponent, canActivate: [PreventLoadIfLoggedInGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeWebsiteRoutingModule { }
