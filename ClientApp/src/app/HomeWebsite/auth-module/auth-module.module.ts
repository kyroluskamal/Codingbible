import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthModuleRoutingModule } from './auth-module-routing.module';
import { LoginComponent } from '../AuthComonents/login/login.component';
import { ResetPasswordComponent } from '../AuthComonents/reset-password/reset-password.component';
import { LoginPageComponent } from '../login-page/login-page.component';
import { RegisterPageComponent } from '../register-page/register-page.component';
import { ForgetPasswordComponent } from '../AuthComonents/forget-password/forget-password.component';
import { RegisterComponent } from '../AuthComonents/register/register.component';
import { EmailConfirmationComponent } from '../AuthComonents/email-confirmation/email-confirmation.component';
import { DialogHandlerService } from 'src/CommonServices/dialog-handler.service';
import { UrlSerializer } from '@angular/router';
import { LowerCaseUrlSerializer } from 'src/CommonServices/LowerCaseUrlSerializer';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { SharedModuleForHomeModule } from 'src/SharedModules/shared-module-for-home.module';
import { SharedModuleForCoursesModule } from 'src/app/Dashboard/Courses/shared-module-for-courses/shared-module-for-courses.module';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
const Commponents = [
  LoginComponent, RegisterComponent,
  ResetPasswordComponent, ForgetPasswordComponent, EmailConfirmationComponent,
  LoginPageComponent, RegisterPageComponent,
];

@NgModule({
  declarations: [Commponents],
  imports: [
    ReactiveFormsModule, MatInputModule, CommonModule, MatDialogModule,
    MatIconModule, MatCardModule, MatFormFieldModule, FormsModule, MatButtonModule,
    AuthModuleRoutingModule, SharedModuleForHomeModule, TooltipModule, MatProgressSpinnerModule
  ],
  providers: [DialogHandlerService,
    { provide: UrlSerializer, useClass: LowerCaseUrlSerializer }
  ]
})
export class AuthModuleModule { }
