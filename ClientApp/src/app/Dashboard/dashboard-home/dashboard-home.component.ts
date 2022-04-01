import { Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { MediaChange, MediaObserver } from '@angular/flex-layout';
import { MatDrawerMode } from '@angular/material/sidenav';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { filter, Observable, Subscription } from 'rxjs';
import { NotificationsService } from 'src/CommonServices/notifications.service';
import { css, NotificationMessage, sweetAlert } from 'src/Helpers/constants';
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
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardHomeComponent implements OnInit
{
  //#region Properties
  //Properties ............................................................................
  FullscreenEnabled: boolean = false;
  Display: string = "";
  SideNav_Content_class: string = "";
  ToggleClass: string = "";
  preventMouseLeave: boolean = false;
  choosenColor: boolean = false;
  SideNav_openingStatus: boolean = true;
  SideNav_mode: MatDrawerMode = "side";
  pinned: boolean = false;
  hasBackDrop: boolean = false;
  //#endregion
  /** Subscription to the Directionality change EventEmitter. */


  //#endregion
  SidenavThemeClass: any;
  ToolbarThemeClass: any;
  BodyThemeClass: any;
  SelectedLanguage: any;
  ChoosenThemeColor: any;
  MediaSubscription: Subscription = new Subscription();
  CurrentUrl: string = "";
  User: Observable<ApplicationUser | null> = new Observable<ApplicationUser | null>();
  IsLoggedIn: Observable<{ isLoggedIn: boolean, Checked: boolean, tokenExpire: string; }> = new Observable<{ isLoggedIn: boolean, Checked: boolean, tokenExpire: string; }>();
  UserRoles: Observable<string[]> = new Observable<string[]>();
  @ViewChild("FullscreenButton", { read: ElementRef }) FullscreenButton: ElementRef<HTMLButtonElement> = {} as ElementRef<HTMLButtonElement>;
  SideNavItems: ExpansionPanel[] = SideNav_items;
  pinned$ = this.store.select(selectPinned);
  //#region Constructor
  //Constructor............................................................................
  constructor(private location: Location,
    private Notifications: NotificationsService, private mediaObserver: MediaObserver,
    private router: Router, private store: Store)
  {
    this.User = this.store.select(selectUser);
    this.IsLoggedIn = this.store.select(selectIsLoggedIn);
    this.UserRoles = this.store.select(selectUserRoles);
    // //set the fixed ot non fixed sidenav
    // if (localStorage.getItem(LocalStorageKeys.FixedSidnav))
    // {
    //   this.pinned = localStorage.getItem(LocalStorageKeys.FixedSidnav) === "false" ? false : true;
    // } else
    // {
    //   this.pinned = false;
    //   localStorage.setItem(LocalStorageKeys.FixedSidnav, String(this.pinned));
    // }
    this.pinned$.subscribe(
      r =>
      {
        this.pinned = r;
        if (r)
        {
          this.Display = "d-inline";
          this.preventMouseLeave = true;
          this.ToggleClass = css.Dashboard.SidNav.fullOpend;
          this.SideNav_Content_class = css.Dashboard.SidNav.content.ltr.pinned;
        } else
        {
          this.Display = "d-none";
          this.preventMouseLeave = false;
          this.ToggleClass = css.Dashboard.SidNav.halfClosed;
          this.SideNav_Content_class = css.Dashboard.SidNav.content.ltr.nonPinned;
        }
        if (!r) this.SideNavItems.forEach(i => i.expanded = false);
        else
        {
          for (let item of this.SideNavItems)
          {
            for (let link of item.links)
            {
              // if (this.CurrentUrl.includes(link.link))
              // {
              //   item.expanded = true;
              // }
            }
          }
        }
        this.router.events.pipe(
          filter(event => event instanceof NavigationEnd)
        )
          .subscribe((event: any) =>
          {
            for (let item of this.SideNavItems)
            {
              for (let link of item.links)
              {
                // if (event.url.split("/").pop() === link.link.split('/').pop())
                // {
                //   if (!this.pinned) item.expanded = false;
                //   else item.expanded = true;
                //   link.state = true;
                // }
                // else link.state = false;
              }
            }
          });
      }
    );
  }

  //#endregion

  //NgOn it .....................................................................
  ngOnInit(): void
  {
    this.store.dispatch(LoadPOSTs());
  }

  close()
  {

  }

  PinSideNav()
  {
    this.pinned = !this.pinned;
    this.store.dispatch(PinnedMenu({ pinned: this.pinned }));
    this.pinnedRTLClassSettings();
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

  pinnedRTLClassSettings()
  {
    if (this.pinned)
    {
      this.Display = "d-inline";
      this.preventMouseLeave = true;
      this.ToggleClass = css.Dashboard.SidNav.fullOpend;
      this.SideNav_Content_class = css.Dashboard.SidNav.content.ltr.pinned;
    } else
    {
      this.Display = "d-none";
      this.preventMouseLeave = false;
      this.ToggleClass = css.Dashboard.SidNav.fullOpend;
      this.SideNav_Content_class = css.Dashboard.SidNav.content.ltr.nonPinned;
    }
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
  }


}
