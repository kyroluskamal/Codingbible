import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { ApplicationUser } from 'src/models.model';
import { Logout } from 'src/State/AuthState/auth.actions';
import { selectIsLoggedIn, selectUser, selectUserRoles } from 'src/State/AuthState/auth.reducer';
import { AuthRoutes, DashboardRoutes } from '../../../Helpers/router-constants';
@Component({
  selector: 'app-home-nav-menu',
  templateUrl: './home-nav-menu.component.html',
  styleUrls: ['./home-nav-menu.component.css'],
})
export class HomeNavMenuComponent implements OnInit
{
  MenuOpen: boolean = false;
  IsLoggedIn = this.store.select(selectIsLoggedIn);
  UserRoles = this.store.select(selectUserRoles);
  DashboardHome = DashboardRoutes.Home;
  AuthRoutes = AuthRoutes;
  User = this.store.select(selectUser);
  constructor(
    private store: Store,
  )
  {

  }

  ngOnInit(): void
  {
  }
  logout()
  {
    this.store.dispatch(Logout());
  }
}
