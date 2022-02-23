import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ForgetPasswordComponent } from 'src/app/HomeWebsite/AuthComonents/forget-password/forget-password.component';
import { LoginComponent } from 'src/app/HomeWebsite/AuthComonents/login/login.component';
import { RegisterComponent } from 'src/app/HomeWebsite/AuthComonents/register/register.component';

@Injectable({
  providedIn: 'root'
})
export class DialogHandlerService
{

  constructor(public Dialog: MatDialog)
  {

  }

  OpenLogin()
  {
    this.Dialog.open(LoginComponent);
  }
  OpenRegister()
  {
    this.Dialog.open(RegisterComponent);
  }
  CloseDialog()
  {
    this.Dialog.closeAll();
  }
  OpenForgetPassword()
  {
    this.Dialog.open(ForgetPasswordComponent);
  }
}
