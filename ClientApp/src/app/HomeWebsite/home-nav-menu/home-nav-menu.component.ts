import { Platform } from '@angular/cdk/platform';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Component, ElementRef, Inject, Input, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
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
export class HomeNavMenuComponent implements OnInit, AfterViewInit
{
  MenuOpen: boolean = false;
  IsLoggedIn = this.store.select(selectIsLoggedIn);
  UserRoles = this.store.select(selectUserRoles);
  DashboardHome = DashboardRoutes.Home;
  AuthRoutes = AuthRoutes;
  User = this.store.select(selectUser);
  @Input() lang: string = "en";
  @ViewChild("en", { static: true }) en: ElementRef<HTMLButtonElement> = {} as ElementRef<HTMLButtonElement>;
  @ViewChild("ar", { static: true }) ar: ElementRef<HTMLButtonElement> = {} as ElementRef<HTMLButtonElement>;
  constructor(
    @Inject(PLATFORM_ID) private platformId: string,
    @Inject(DOCUMENT) private document: Document,
    private store: Store,
  )
  {

  }
  ngAfterViewInit(): void
  {
    if (this.lang == "ar")
    {
      this.en.nativeElement.classList.remove("buttonAction");
      this.ar.nativeElement.classList.add("buttonAction");
    } else
    {
      this.en.nativeElement.classList.add("buttonAction");
      this.ar.nativeElement.classList.remove("buttonAction");
    }
  }

  ngOnInit(): void
  {
    if (isPlatformBrowser(this.platformId))
    {
      let allDropDowns = this.document.querySelectorAll(".nav-item.dropdown");
      for (let i = 0; i < allDropDowns.length; i++)
      {
        let menu = <HTMLElement>allDropDowns[i].getElementsByTagName("ul")[0];
        allDropDowns[i].addEventListener("mouseover", () =>
        {
          menu.classList.add("show");
        });
        allDropDowns[i].addEventListener("mouseleave", () =>
        {
          menu.classList.remove("show");
        });
      }
      this.document.addEventListener("click", (e) =>
      {
        let allMenus = this.document.querySelectorAll(".dropdown-menu");
        for (let i = 0; i < allMenus.length; i++)
        {
          allMenus[i].classList.remove("show");
        }
      });
    }
  }
  logout()
  {
    this.store.dispatch(Logout());
  }
}
