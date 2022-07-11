import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Store } from '@ngrx/store';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { CookieNames } from 'src/Helpers/constants';
import { AuthRoutes } from 'src/Helpers/router-constants';
import { AccountService } from 'src/Services/account.service';
import { IsLoggedIn } from 'src/State/AuthState/auth.actions';
import { selectIsLoggedIn } from 'src/State/AuthState/auth.reducer';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate
{
  IsLoggedIn$ = this.store.select(selectIsLoggedIn);
  constructor(private accountService: AccountService,
    private store: Store, private router: Router)
  {

  }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree
  {
    let loggedIn = false;
    let checked = false;
    let refershTokenExp: string = "";
    let x = this.IsLoggedIn$.subscribe(
      r => { loggedIn = r.isLoggedIn, checked = r.Checked, refershTokenExp = r.tokenExpire; }
    );
    if (!checked || new Date(refershTokenExp) <= new Date())
      this.accountService.IsLoggedIn().subscribe(
        r =>
        {
          loggedIn = r;
          this.store.dispatch(IsLoggedIn({ isLoggedIn: Boolean(r), checked: true }));
        }
      );
    if (!loggedIn)
      this.router.navigate(["", AuthRoutes.account, AuthRoutes.Login]);
    return loggedIn;
  }

}
