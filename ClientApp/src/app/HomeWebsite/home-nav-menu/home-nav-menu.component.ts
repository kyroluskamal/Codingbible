import { isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { ApplicationUser } from 'src/models.model';
import { Logout } from 'src/State/AuthState/auth.actions';
import { selectIsLoggedIn, selectUser, selectUserRoles } from 'src/State/AuthState/auth.reducer';
import * as Routes from '../../../Helpers/router-constants';
@Component({
  selector: 'app-home-nav-menu',
  templateUrl: './home-nav-menu.component.html',
  styleUrls: ['./home-nav-menu.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush

})
export class HomeNavMenuComponent implements OnInit
{
  MenuOpen: boolean = false;
  Routes = Routes;
  User: Observable<ApplicationUser | null> = new Observable<ApplicationUser | null>();
  IsLoggedIn: Observable<{ isLoggedIn: boolean, Checked: boolean, tokenExpire: string; }> = new Observable<{ isLoggedIn: boolean, Checked: boolean, tokenExpire: string; }>();
  UserRoles: Observable<string[]> = new Observable<string[]>();
  constructor(
    private store: Store,
    @Inject(PLATFORM_ID) private platformId: Object)
  {
    if (isPlatformBrowser(this.platformId))
    {
      this.User = this.store.select(selectUser);
      this.IsLoggedIn = this.store.select(selectIsLoggedIn);
      this.UserRoles = this.store.select(selectUserRoles);
    }
  }

  ngOnInit(): void
  {
  }
  logout()
  {
    if (isPlatformBrowser(this.platformId))
      this.store.dispatch(Logout());
  }
}
