import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { MediaChange, MediaObserver } from '@angular/flex-layout';
import { MenuPositionX, MenuPositionY } from '@angular/material/menu';
import { MatDrawerMode, MatSidenav } from '@angular/material/sidenav';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { IconNamesEnum } from 'ngx-bootstrap-icons';
import { filter, Subscription } from 'rxjs';
import { NotificationsService } from 'src/CommonServices/notifications.service';
import { css, LocalStorageKeys, NotificationMessage, sweetAlert } from 'src/Helpers/constants';
import { ExpansionPanel } from 'src/Interfaces/interfaces';
import { PinnedMenu } from 'src/State/DesignState/design.actions';
import { selectPinned } from 'src/State/DesignState/design.reducer';
import { LoadPOSTs } from 'src/State/PostState/post.actions';
import { SideNav_items } from '../SideNavItems';

@Component({
  selector: 'app-dashboard-home',
  templateUrl: './dashboard-home.component.html',
  styleUrls: ['./dashboard-home.component.css']
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
  @ViewChild("FullscreenButton", { read: ElementRef }) FullscreenButton: ElementRef<HTMLButtonElement> = {} as ElementRef<HTMLButtonElement>;
  SideNavItems: ExpansionPanel[] = SideNav_items;
  pinned$ = this.store.select(selectPinned);
  //#region Constructor
  //Constructor............................................................................
  constructor(
    private Notifications: NotificationsService, private mediaObserver: MediaObserver,
    private router: Router, private store: Store)
  {
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

    // if (this.pinned === false)
    // {
    //   for (let item of this.SideNavItems)
    //   {
    //     item.expanded = false;
    //   }
    // } else
    // {
    //   for (let item of this.SideNavItems)
    //   {
    //     for (let link of item.links)
    //     {
    //       // if (this.CurrentUrl.includes(link.link))
    //       // {
    //       //   item.expanded = true;
    //       // }
    //     }
    //   }
    // }
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
        console.log(response);
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


}
