import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ForgetPasswordModel, HttpResponsesObject, LoginViewModel, RegisterViewModel, ResetPasswordModel } from "../models.model";
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
    return this.httpClient.post<LoginViewModel>(AccountController.Login, LoginViewModel, { headers: { 'No-Auth': 'True' } });
  }

  Register(RegisterViewModel: RegisterViewModel): Observable<any>
  {
    return this.httpClient.post<RegisterViewModel>(AccountController.Register, RegisterViewModel, { headers: { 'No-Auth': 'True' } });
  }

  EmailConfirmations(email: string, token: string)
  {
    return this.httpClient.get(`${AccountController.emailConfirm}?token=${token}&email=${email}`, { headers: { 'No-Auth': 'True' } });
  }

  IsLoggedIn(): Observable<any>
  {

    return this.httpClient.get(`${AccountController.IsLoggedIn}`);
  }

  ForgetPassword(model: ForgetPasswordModel): Observable<any>
  {
    return this.httpClient.post<ForgetPasswordModel>(AccountController.ForgetPassword, model);
  }

  ResetPassword(model: ResetPasswordModel): Observable<any>
  {
    return this.httpClient.post<ResetPasswordModel>(AccountController.ResetPassword, model);
  }
  logout()
  {
    return this.httpClient.get(AccountController.Logout);
  }
}
