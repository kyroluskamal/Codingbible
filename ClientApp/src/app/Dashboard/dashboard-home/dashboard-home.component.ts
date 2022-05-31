import { DOCUMENT, Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, HostListener, Inject, OnInit, ViewChild } from '@angular/core';
import { MediaChange, MediaObserver } from '@angular/flex-layout';
import { MatDrawerMode, MatSidenav } from '@angular/material/sidenav';
import { Title } from '@angular/platform-browser';
import { Router, RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { CookieService } from 'ngx-cookie-service';
import { Observable, Subscription } from 'rxjs';
import { NotificationsService } from 'src/CommonServices/notifications.service';
import { CookieNames, css, NotificationMessage, sweetAlert } from 'src/Helpers/constants';
import { DashboardRoutes } from 'src/Helpers/router-constants';
import { ExpansionPanel } from 'src/Interfaces/interfaces';
import { ApplicationUser } from 'src/models.model';
import { Logout } from 'src/State/AuthState/auth.actions';
import { selectIsLoggedIn, selectUser, selectUserRoles } from 'src/State/AuthState/auth.reducer';
import { PinnedMenu } from 'src/State/DesignState/design.actions';
import { selectPinned } from 'src/State/DesignState/design.reducer';
import { LoadPOSTs } from 'src/State/PostState/post.actions';
import { SideNav_items } from '../SideNavItems';

@Component({
  selector: 'app-dashboard-home',
  templateUrl: './dashboard-home.component.html',
  styleUrls: ['./dashboard-home.component.css'],
})
export class DashboardHomeComponent implements OnInit
{
  //#region Properties
  //Properties ............................................................................
  FullscreenEnabled: boolean = false;
  Display: string = "";
  SideNav_Content_class: string = "";
  ToggleClass: string = "";
  choosenColor: boolean = false;
  SideNav_openingStatus: boolean = true;
  SideNav_mode: MatDrawerMode = "side";
  pinned: boolean = false;
  hasBackDrop: boolean = false;
  //#endregion
  /** Subscription to the Directionality change EventEmitter. */


  //#endregion
  MediaSubscription: Subscription = new Subscription();
  User: Observable<ApplicationUser | null> = new Observable<ApplicationUser | null>();
  IsLoggedIn: Observable<{ isLoggedIn: boolean, Checked: boolean, tokenExpire: string; }> = new Observable<{ isLoggedIn: boolean, Checked: boolean, tokenExpire: string; }>();
  UserRoles: Observable<string[]> = new Observable<string[]>();
  @ViewChild("FullscreenButton", { read: ElementRef }) FullscreenButton: ElementRef<HTMLButtonElement> = {} as ElementRef<HTMLButtonElement>;
  @ViewChild("SideNav") SideNav!: MatSidenav;
  SideNavItems: ExpansionPanel[] = SideNav_items;
  pinned$ = this.store.select(selectPinned);
  //#region Constructor
  //Constructor............................................................................
  constructor(private location: Location, private title: Title,
    @Inject(DOCUMENT) private document: Document,
    private Notifications: NotificationsService, private mediaObserver: MediaObserver,
    private router: Router, private store: Store, private CookieService: CookieService)
  {
    this.title.setTitle("Dashboard");
    this.User = this.store.select(selectUser);
    this.IsLoggedIn = this.store.select(selectIsLoggedIn);
    this.UserRoles = this.store.select(selectUserRoles);

    this.pinned$.subscribe(
      r =>
      {
        this.pinned = r;
        if (r)
        {
          this.SideNav_Content_class = css.Dashboard.SidNav.content.ltr.pinned;
        } else
        {
          this.SideNav_Content_class = css.Dashboard.SidNav.content.ltr.nonPinned;
        }
      }
    );
  }


  //#endregion

  //NgOn it .....................................................................
  ngOnInit(): void
  {
    if (this.CookieService.get(CookieNames.Access_token) == null ||
      this.CookieService.get(CookieNames.loginStatus) == null ||
      this.CookieService.get(CookieNames.loginStatus) == "0")
    {
      this.store.dispatch(Logout());
      this.router.navigate(['/account/login']);
    }
    this.store.dispatch(LoadPOSTs());
    // this.router.events.pipe(filter(event => event instanceof NavigationEnd))
    //   .subscribe(e =>
    //   {
    //     console.log(e);

    //     //Do something with the NavigationEnd event object.
    //   });
    for (let item of this.SideNavItems)
    {
      if (this.router.url.split("/")[item.itemLevel! + 1]?.includes(item.title.toLowerCase())
        && this.router.url.split("/").length === item.itemLevel! + 2)
      {
        item.expanded = true;
      } else
      {
        item.expanded = false;
      }
      for (let link of item.links)
      {
        if (link.link[link.link.length - 1] === this.router.url.split("/").pop()!)
        {
          link.state = true;
        } else 
        {
          link.state = false;
        }
      }
    }
  }

  PinSideNav()
  {
    this.pinned = !this.pinned;
    this.store.dispatch(PinnedMenu({ pinned: this.pinned }));
  }

  ToggleFullscreen()
  {
    if (!document.fullscreenEnabled)
      this.Notifications.Error_Swal(sweetAlert.Title.Error, sweetAlert.ButtonText.OK, NotificationMessage.Error.BrowserDontSupportFullscreen);
    else if (!document.fullscreenElement) document.documentElement.requestFullscreen();
    else { document.exitFullscreen(); }
  }

  //Only to toggle fullscreen ICON ...........................................................................
  @HostListener("window:resize") ToggleFullScreenIcon()
  {
    if (document.fullscreenElement)
      this.FullscreenEnabled = true;
    else
      this.FullscreenEnabled = false;
  }




  /****************************************************************************************
  * ..................................... SidNav at small screens......................
  ****************************************************************************************/
  ngAfterContentInit(): void
  {
    this.MediaSubscription = this.mediaObserver.asObservable().subscribe(
      (response: MediaChange[]) =>
      {
        var matRangLanble = document.getElementsByClassName("mat-paginator-range-label");
        if (response.some(x => x.mqAlias === 'xs'))
        {

          this.SideNav_mode = "over";
          this.hasBackDrop = true;
          this.SideNav_openingStatus = false;
          for (let i = 0; i < matRangLanble.length; i++)
          {
            (<HTMLDivElement>matRangLanble[i]).style.setProperty("display", "none");
          }
        } else
        {
          this.SideNav_mode = "side";
          this.hasBackDrop = false;
          this.SideNav_openingStatus = true;
          for (let i = 0; i < matRangLanble.length; i++)
            for (let i = 0; i < matRangLanble.length; i++)
            {
              (<HTMLDivElement>matRangLanble[i]).style.setProperty("display", "flex");
            }
        };
      });
  }
  ngOnDestroy(): void
  {
    this.MediaSubscription.unsubscribe();
  }

  getRouterState(DashBoardOutlet: RouterOutlet)
  {
    return DashBoardOutlet.isActivated ? DashBoardOutlet.activatedRoute.snapshot.url[0].path : "none";
  }

  OpenExpAndCloseAll(index: number)
  {
    for (let i = 0; i < this.SideNavItems.length; i++)
    {
      if (i === index)
      {
        if (this.SideNavItems[i].expanded == true)
          this.SideNavItems[i].expanded = false;
        else this.SideNavItems[i].expanded = true;
      }
      else
      {
        this.SideNavItems[i].expanded = false;

      };
    }
  }

  logout()
  {
    this.store.dispatch(Logout());
  }
  @HostListener('window:keydown', ['$event'])
  keyEvent(event: KeyboardEvent)
  {
    let ArrowLeft = event.key === "ArrowLeft";
    let ArrowRight = event.key === "ArrowRight";
    if (event.ctrlKey && ArrowLeft) this.location.back();
    if (event.ctrlKey && ArrowRight) this.location.forward();
    if (event.ctrlKey && event.altKey && event.key === "s") { this.PinSideNav(); this.SideNav.toggle(); };
  }

  expandSideNavItem(index: number)
  {
    for (let i = 0; i < this.SideNavItems.length; i++)
    {
      if (i === index)
      {
        this.SideNavItems[i].expanded = true;
      } else
      {
        this.SideNavItems[i].expanded = false;
      }
    }
  }
  ActivateSideNavLink(itemIndex: number, linkIndex: number)
  {
    this.SideNavItems[itemIndex].links[linkIndex].state = true;
    for (let i = 0; i < this.SideNavItems.length; i++)
    {
      for (let j = 0; j < this.SideNavItems[i].links.length; j++)
      {
        if (i === itemIndex && j === linkIndex)
        {
          this.SideNavItems[i].links[j].state = true;
        }
        else
        {
          this.SideNavItems[i].links[j].state = false;
        }
      }
    }
  }
  HideStickyNotes()
  {
    let url = this.router.url;
    if (!url.includes(DashboardRoutes.Posts.AddPost)
      && !url.includes(DashboardRoutes.Posts.EditPost)
      && !url.includes(DashboardRoutes.Courses.Lessons.AddLesson)
      && !url.includes(DashboardRoutes.Courses.Lessons.EditLesson)
    )
    {
      let stickyNote = this.document.getElementById("StickyNotesContainer");
      if (stickyNote)
        stickyNote?.remove();
    }
  }
}
