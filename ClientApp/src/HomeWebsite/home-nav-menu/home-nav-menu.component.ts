import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectIsLoggedIn, selectUser } from 'src/State/AuthState/auth.reducer';
import { DialogHandlerService } from '../../CommonServices/dialog-handler.service';

@Component({
  selector: 'app-home-nav-menu',
  templateUrl: './home-nav-menu.component.html',
  styleUrls: ['./home-nav-menu.component.css']
})
export class HomeNavMenuComponent implements OnInit
{
  User = this.store.select(selectUser);
  IsLoggedIn = this.store.select(selectIsLoggedIn);

  constructor(public dialogHandler: DialogHandlerService, private store: Store) { }

  ngOnInit(): void
  {
  }

}
