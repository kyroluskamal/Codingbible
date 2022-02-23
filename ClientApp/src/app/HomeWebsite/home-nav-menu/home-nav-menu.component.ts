import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { IconNamesEnum } from 'ngx-bootstrap-icons';
import { CookieService } from 'ngx-cookie-service';
import { DropDownAnimation } from 'src/Animations/animations';
import { CookieNames } from 'src/Helpers/constants';
import { Logout } from 'src/State/AuthState/auth.actions';
import { selectIsLoggedIn, selectUser, selectUserRoles } from 'src/State/AuthState/auth.reducer';
import { DialogHandlerService } from '../../../CommonServices/dialog-handler.service';
import * as Routes from '../../../Helpers/router-constants';
@Component({
  selector: 'app-home-nav-menu',
  templateUrl: './home-nav-menu.component.html',
  styleUrls: ['./home-nav-menu.component.css'],
  animations: [DropDownAnimation]
})
export class HomeNavMenuComponent implements OnInit
{
  BootstrapIcons = IconNamesEnum;
  MenuOpen: boolean = false;
  Routes = Routes;
  User = this.store.select(selectUser);
  IsLoggedIn = this.store.select(selectIsLoggedIn);
  UserRoles = this.store.select(selectUserRoles);
  constructor(public dialogHandler: DialogHandlerService, private datePipe: DatePipe,
    private store: Store, private cookieServ: CookieService) { }

  ngOnInit(): void
  {
    console.log(this.cookieServ.get(CookieNames.refershTokenExpire).toString().replace("%2F", '/').replace("%20", ' ').replace("%3A", ':'));
    console.log(new Date(this.cookieServ.get(CookieNames.refershTokenExpire).toString().replace("%2F", '/').replace("%20", ' ').replace("%3A", ':')));
    this.IsLoggedIn.subscribe(r => console.log(r));
  }
  logout()
  {
    this.store.dispatch(Logout());
  }
}
