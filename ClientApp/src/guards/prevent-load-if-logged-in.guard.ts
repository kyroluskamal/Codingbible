import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { DashboardRoutes } from 'src/Helpers/router-constants';
import { selectIsLoggedIn } from 'src/State/AuthState/auth.reducer';

@Injectable({
  providedIn: 'root'
})
export class PreventLoadIfLoggedInGuard implements CanActivate
{
  IsLoggedIn$ = this.store.select(selectIsLoggedIn);
  constructor(private store: Store, private router: Router) { }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree
  {
    let loggedIn = false;
    this.IsLoggedIn$.subscribe(
      r =>
      {
        loggedIn = r.isLoggedIn;
        if (r.isLoggedIn)
        {
          this.router.navigate(['', DashboardRoutes.Home]);
        }
      });
    return !loggedIn;
  }

}
