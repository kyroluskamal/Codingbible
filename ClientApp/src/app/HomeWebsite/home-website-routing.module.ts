import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PreventLoadIfLoggedInGuard } from 'src/guards/prevent-load-if-logged-in.guard';
import { AuthRoutes, HomeRoutes } from '../../Helpers/router-constants';
import { EmailConfirmationComponent } from './AuthComonents/email-confirmation/email-confirmation.component';
import { ResetPasswordComponent } from './AuthComonents/reset-password/reset-password.component';

import { HomeComponent } from './home/home.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { RegisterPageComponent } from './register-page/register-page.component';

export const RoutesForHomeModule: Routes = [

  {
    path: "", children: [
      { path: AuthRoutes.Login.toLowerCase(), component: LoginPageComponent, canActivate: [PreventLoadIfLoggedInGuard] },
      { path: AuthRoutes.Register.toLowerCase(), component: RegisterPageComponent, canActivate: [PreventLoadIfLoggedInGuard] },
      { path: AuthRoutes.ResetPassword.toLowerCase(), component: ResetPasswordComponent, canActivate: [PreventLoadIfLoggedInGuard] },
      { path: AuthRoutes.emailConfirmation.toLowerCase(), component: EmailConfirmationComponent, canActivate: [PreventLoadIfLoggedInGuard] }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(RoutesForHomeModule)],
  exports: [RouterModule]
})
export class HomeWebsiteRoutingModule { }
