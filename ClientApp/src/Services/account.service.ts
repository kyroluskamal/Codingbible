import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ForgetPasswordModel, LoginViewModel, RegisterViewModel, ResetPasswordModel } from "../models.model";
import { AccountController } from '../Helpers/apiconstants';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AccountService
{

  constructor(private httpClient: HttpClient) { }

  Login(LoginViewModel: LoginViewModel): Observable<any>
  {
    return this.httpClient.post<LoginViewModel>(AccountController.Login, LoginViewModel);
  }

  Register(RegisterViewModel: RegisterViewModel): Observable<any>
  {
    return this.httpClient.post<RegisterViewModel>(AccountController.Register, RegisterViewModel);
  }

  EmailConfirmations(email: string, token: string)
  {
    return this.httpClient.get(`${AccountController.emailConfirm}?token=${token}&email=${email}`);
  }

  IsUserFoundByEmail(email: string)
  {
    if (!email) return;
    return this.httpClient.get(`${AccountController.IsUserFoundByEmail}?email=${email}`);
  }

  ForgetPassword(model: ForgetPasswordModel): Observable<any>
  {
    return this.httpClient.post<ForgetPasswordModel>(AccountController.ForgetPassword, model);
  }

  ResetPassword(model: ResetPasswordModel): Observable<any>
  {
    return this.httpClient.post<ResetPasswordModel>(AccountController.ResetPassword, model);
  }
}
