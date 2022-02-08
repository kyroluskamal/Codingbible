import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoginViewModel } from "../models.model";
import { AdminAccountController } from '../Helpers/apiconstants';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AccountService
{

  constructor(private httpClient: HttpClient) { }

  Login(LoginViewModel: LoginViewModel): Observable<any>
  {
    return this.httpClient.post<LoginViewModel>(AdminAccountController.Login, LoginViewModel);
  }
}
