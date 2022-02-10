import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ForgetPasswordComponent } from 'src/HomeWebsite/AuthComonents/forget-password/forget-password.component';
import { LoginComponent } from '../HomeWebsite/AuthComonents/login/login.component';
import { RegisterComponent } from '../HomeWebsite/AuthComonents/register/register.component';

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
