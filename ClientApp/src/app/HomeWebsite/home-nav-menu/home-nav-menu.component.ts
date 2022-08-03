import { DOCUMENT } from '@angular/common';
import { Component, ElementRef, Inject, Input, OnChanges, OnInit, PLATFORM_ID, SimpleChanges, ViewChild, ViewEncapsulation } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { combineLatest, filter, map, Observable, switchMap, tap } from 'rxjs';
import { Menu, MenuItem } from 'src/models.model';
import { TreeDataStructureService } from 'src/Services/tree-data-structure.service';
import { Logout } from 'src/State/AuthState/auth.actions';
import { selectIsLoggedIn, selectUser, selectUserRoles } from 'src/State/AuthState/auth.reducer';
import { SET_LANGUAGE } from 'src/State/LangState/lang.acitons';
import { selectLang } from 'src/State/LangState/lang.reducer';
import { GetMenuByLocationName } from 'src/State/Menu/menu.actions';
import { selectMenuByLocationName } from 'src/State/Menu/menu.reducer';
import { AuthRoutes, DashboardRoutes } from '../../../Helpers/router-constants';
import { NavChildsComponent } from './nav-childs/nav-childs.component';
@Component({
  selector: 'app-home-nav-menu',
  templateUrl: './home-nav-menu.component.html',
  styleUrls: ['./home-nav-menu.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class HomeNavMenuComponent implements OnInit, OnChanges
{
  MenuOpen: boolean = false;
  IsLoggedIn = this.store.select(selectIsLoggedIn);
  UserRoles = this.store.select(selectUserRoles);
  DashboardHome = DashboardRoutes.Home;
  AuthRoutes = AuthRoutes;
  isArabic = this.store.select(selectLang);
  User = this.store.select(selectUser);
  selectedMenu: Menu | null = null;
  menuItemsRoots: MenuItem[] = [];
  @Input() LocationName: string = 'home';
  locName = this.LocationName;

  MenusItems: Observable<MenuItem[]> = new Observable<MenuItem[]>();
  @ViewChild("en", { static: true }) en: ElementRef<HTMLButtonElement> = {} as ElementRef<HTMLButtonElement>;
  @ViewChild("ar", { static: true }) ar: ElementRef<HTMLButtonElement> = {} as ElementRef<HTMLButtonElement>;
  constructor(
    private router: Router,
    private tree: TreeDataStructureService<MenuItem>,
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

  ngAfterViewInit(): void
  {
    this.handleDropDowns();

  }
  ngOnChanges(changes: SimpleChanges): void
  {
    if ('LocationName' in changes)
    {
      this.locName = changes['LocationName'].currentValue;
      this.changeMenu();
    }
  }

  ngOnInit(): void
  {
    this.changeMenu();
    this.document.addEventListener("click", (e) =>
    {
      let allMenus = this.document.querySelectorAll(".dropdown-menu");
      for (let i = 0; i < allMenus.length; i++)
      {
        allMenus[i].classList.remove("show");
      }
    });
  }
  logout()
  {
    this.store.dispatch(Logout());
  }
  gotToEnglish()
  {
    this.store.dispatch(SET_LANGUAGE({ isArabic: false }));
    this.router.navigate([`${this.router.url.replace('/ar', '')}`]);
  }
  gotToArabic()
  {
    this.router.navigate([`/ar/${this.router.url}`]);
    this.store.dispatch(SET_LANGUAGE({ isArabic: true }));
  }
  RootChildren(MenuItemRoot: MenuItem)
  {
    return this.tree.getChilrenByParentId(MenuItemRoot.id!);
  }
  handleDropDowns()
  {

    let allDropDowns = this.document.querySelectorAll(".nav-item.dropdown");
    console.log(allDropDowns);
    for (let i = 0; i < allDropDowns.length; i++)
    {

      let dropdown = <HTMLElement>allDropDowns[i];
      let menu = dropdown.getElementsByTagName("ul")[0];
      menu.addEventListener("mouseleave", (e) =>
      {
        menu.classList.remove("show");
      });
      dropdown.addEventListener("mouseover", () =>
      {
        menu.classList.add("show");
      });
      allDropDowns[i].addEventListener("mouseleave", () =>
      {
        console.log("mouseleave");
        menu.classList.remove("show");
      });


    }
  }
  dorpDownOpen(menu: HTMLElement, parent: HTMLElement)
  {
    menu.classList.add("show");
    parent.classList.add("active");
  }
  dropDownCLose(menu: HTMLElement, parent: HTMLElement)
  {
    // let isChildIsOpen = false;
    // if (menu.children.length === 0)
    // {
    //   for (let i = 0; i < menu.children.length; i++)
    //   {
    //     if (menu.children[i].classList.contains("show"))
    //     {
    //       isChildIsOpen = true;
    //     }
    //   }
    // }
    // if (!isChildIsOpen)
    //   menu.classList.remove("show");
    parent.classList.remove("active");
  }
  changeMenu()
  {
    this.MenusItems = this.store.select(selectMenuByLocationName(this.locName)).pipe(
      tap(Menus =>
      {
        if (Menus)
        {
          this.selectedMenu = Menus;
        } else
        {
          this.store.dispatch(GetMenuByLocationName({ LocationName: this.LocationName }));
        }
      }),
      map(r =>
      {
        if (r)
        {
          this.tree.setData(this.selectedMenu?.menuItems!);
          return this.tree.getRawRoots().sort((a, b) => a.orderWithinParent - b.orderWithinParent);
        }
        return [];
      })
    );
  }
}
