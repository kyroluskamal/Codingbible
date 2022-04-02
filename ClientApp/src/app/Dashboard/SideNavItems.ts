import { DashboardRoutes, DashboardRoutesText } from 'src/Helpers/router-constants';
import { ExpansionPanel } from 'src/Interfaces/interfaces';


export let SideNav_items: ExpansionPanel[] = [
  {
    title: "Dashboard",
    expanded: false,
    links: [
      { link: ['', DashboardRoutes.Home], LinkText: "Home", state: false },
    ],
    itemLevel: 0,
    bootstrapIcon: "bi bi-speedometer2"
  },
  {
    title: DashboardRoutesText.Posts.Main,
    expanded: false,
    links: [
      { link: ['', DashboardRoutes.Home, DashboardRoutes.Posts.Home], LinkText: DashboardRoutesText.Posts.All, state: false },
      { link: ['', DashboardRoutes.Home, DashboardRoutes.Posts.Home, DashboardRoutes.Posts.AddPost], LinkText: DashboardRoutesText.Posts.AddPost, state: false },
    ],
    itemLevel: 1,
    bootstrapIcon: "bi bi-pin-angle-fill"
  },
];
