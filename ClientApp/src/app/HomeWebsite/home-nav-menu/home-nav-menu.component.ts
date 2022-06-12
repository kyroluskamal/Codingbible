import { Platform } from '@angular/cdk/platform';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Component, ElementRef, Inject, Input, OnChanges, OnInit, PLATFORM_ID, SimpleChanges, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { filter } from 'rxjs';
import { Menu } from 'src/models.model';
import { Logout } from 'src/State/AuthState/auth.actions';
import { selectIsLoggedIn, selectUser, selectUserRoles } from 'src/State/AuthState/auth.reducer';
import { SET_LANGUAGE } from 'src/State/LangState/lang.acitons';
import { selectLang } from 'src/State/LangState/lang.reducer';
import { GetMenuByLocationName } from 'src/State/Menu/menu.actions';
import { selectAll_Menus } from 'src/State/Menu/menu.reducer';
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
  isArabic = this.store.select(selectLang);
  User = this.store.select(selectUser);
  Menus = this.store.select(selectAll_Menus);
  selectedMenu: Menu | null = null;
  @Input() LocationName: string = 'home';

  @ViewChild("en", { static: true }) en: ElementRef<HTMLButtonElement> = {} as ElementRef<HTMLButtonElement>;
  @ViewChild("ar", { static: true }) ar: ElementRef<HTMLButtonElement> = {} as ElementRef<HTMLButtonElement>;
  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: string,
    @Inject(DOCUMENT) private document: Document,
    private store: Store,
  )
  {
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe((event) =>
    {
      if (event instanceof NavigationEnd)
      {
        if (event.url.includes('/ar'))
        {
          this.store.dispatch(SET_LANGUAGE({ isArabic: true }));
        }
        else
        {
          this.store.dispatch(SET_LANGUAGE({ isArabic: false }));
        }
      }
    });
  }
  ngOnInit(): void
  {
    this.store.dispatch(GetMenuByLocationName({ LocationName: this.LocationName }));
    this.Menus.subscribe((Menus) =>
    {
      if (Menus)
      {
        this.selectedMenu = Menus.filter((Menu) => Menu.menuLocations?.name === this.LocationName)[0];
      }
    });
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
  gotToEnglish()
  {
    this.store.dispatch(SET_LANGUAGE({ isArabic: false }));
    this.router.navigate(["/"]);
  }
  gotToArabic()
  {
    this.router.navigate(["/ar"]);
    this.store.dispatch(SET_LANGUAGE({ isArabic: true }));
  }
}
