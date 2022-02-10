import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeWebsiteRoutingModule } from './home-website-routing.module';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './AuthComonents/login/login.component';
import { RegisterComponent } from './AuthComonents/register/register.component';
import { SendCodeComponent } from './AuthComonents/send-code/send-code.component';
import { ValidateCodeComponent } from './AuthComonents/validate-code/validate-code.component';
import { ForgetPasswordComponent } from './AuthComonents/forget-password/forget-password.component';
import { ResetPasswordComponent } from './AuthComonents/reset-password/reset-password.component';
import { HomeNavMenuComponent } from './home-nav-menu/home-nav-menu.component';
import { SharedModule } from '../SharedModules/shared.module';
import { MaterialModule } from '../SharedModules/material.module';
import { LoginPageComponent } from './login-page/login-page.component';
import { RegisterPageComponent } from './register-page/register-page.component';
import { EmailConfirmationComponent } from './AuthComonents/email-confirmation/email-confirmation.component';





const Commponents = [
  HomeComponent, LoginComponent, RegisterComponent, SendCodeComponent, ValidateCodeComponent,
  HomeNavMenuComponent, ResetPasswordComponent, ForgetPasswordComponent, EmailConfirmationComponent,
  LoginPageComponent, RegisterPageComponent
];
@NgModule({
  declarations: [Commponents],
  imports: [
    CommonModule,
    SharedModule, MaterialModule,
    HomeWebsiteRoutingModule
  ],
  exports: [Commponents]
})
export class HomeWebsiteModule { }
