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
    title: DashboardRoutesText.Blog.Main,
    expanded: false,
    links: [
      { link: ['', DashboardRoutes.Home, DashboardRoutes.Posts.Home], LinkText: DashboardRoutesText.Blog.All, state: false },
      { link: ['', DashboardRoutes.Home, DashboardRoutes.Posts.Home, DashboardRoutes.Posts.AddPost], LinkText: DashboardRoutesText.Blog.AddPost, state: false },
      { link: ['', DashboardRoutes.Home, DashboardRoutes.Posts.Home, DashboardRoutes.Posts.Categoris], LinkText: DashboardRoutesText.Blog.Categories, state: false },
    ],
    itemLevel: 1,
    bootstrapIcon: "bi bi-pin-angle-fill"
  },
  {
    title: DashboardRoutesText.Courses.Main,
    expanded: false,
    links: [
      { link: ['', DashboardRoutes.Home, DashboardRoutes.Courses.Home], LinkText: DashboardRoutesText.Courses.All, state: false },
      { link: ['', DashboardRoutes.Home, DashboardRoutes.Courses.Home, DashboardRoutes.Courses.Sections], LinkText: DashboardRoutesText.Courses.Sections, state: false },
      { link: ['', DashboardRoutes.Home, DashboardRoutes.Courses.Home, DashboardRoutes.Courses.Categories], LinkText: DashboardRoutesText.Courses.Categories, state: false },
      { link: ['', DashboardRoutes.Home, DashboardRoutes.Courses.Home, DashboardRoutes.Courses.Lessons.Home], LinkText: DashboardRoutesText.Courses.Lessons.Home, state: false },
    ],
    itemLevel: 2,
    bootstrapIcon: "bi bi-book-fill"
  },
  {
    title: DashboardRoutesText.Appereance.Main,
    expanded: false,
    links: [
      { link: ['', DashboardRoutes.Home, DashboardRoutes.Appereance.Menus], LinkText: DashboardRoutesText.Appereance.Menus, state: false },
    ],
    itemLevel: 3,
    bootstrapIcon: "bi bi-brush-fill"
  },
];
