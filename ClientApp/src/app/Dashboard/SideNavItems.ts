import { faParachuteBox } from '@fortawesome/free-solid-svg-icons';
import { IconNamesEnum } from 'ngx-bootstrap-icons';
import { DashboardRoutes, DashboardRoutesText } from 'src/Helpers/router-constants';
import { ExpansionPanel } from 'src/Interfaces/interfaces';


export let SideNav_items: ExpansionPanel[] = [
  {
    title: "Dashboard",
    expanded: false,
    links: [
      { link: [''], LinkText: "Home", state: false },
    ],
    boostrapIcon: IconNamesEnum.Speedometer2
  },
  {
    title: DashboardRoutesText.Posts.Main,
    expanded: false,
    links: [
      { link: ['', DashboardRoutes.Home, DashboardRoutes.Posts.Home], LinkText: DashboardRoutesText.Posts.All, state: false },
      { link: ['', DashboardRoutes.Home, DashboardRoutes.Posts.Home, DashboardRoutes.Posts.AddPost], LinkText: DashboardRoutesText.Posts.AddPost, state: false },
    ],
    boostrapIcon: IconNamesEnum.PinAngleFill
  }
];
