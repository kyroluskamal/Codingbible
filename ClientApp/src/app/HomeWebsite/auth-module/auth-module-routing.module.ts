import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthRoutes } from 'src/Helpers/router-constants';
import { EmailConfirmationComponent } from '../AuthComonents/email-confirmation/email-confirmation.component';
import { ResetPasswordComponent } from '../AuthComonents/reset-password/reset-password.component';
import { LoginPageComponent } from '../login-page/login-page.component';
import { RegisterPageComponent } from '../register-page/register-page.component';

const routes: Routes = [
  {
    path: "", children: [
      { path: AuthRoutes.Login, component: LoginPageComponent },
      { path: AuthRoutes.Register, component: RegisterPageComponent },
      { path: AuthRoutes.ResetPassword, component: ResetPasswordComponent },
      { path: AuthRoutes.emailConfirmation, component: EmailConfirmationComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthModuleRoutingModule { }
