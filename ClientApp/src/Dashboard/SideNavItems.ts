import { faParachuteBox } from '@fortawesome/free-solid-svg-icons';
import { IconNamesEnum } from 'ngx-bootstrap-icons';
import { DashboardRoutes } from 'src/Helpers/router-constants';
import { ExpansionPanel } from 'src/Interfaces/interfaces';


export let SideNav_items: ExpansionPanel[] = [{
  title: "Dashboard",
  expanded: false,
  links: [
    { link: '', LinkText: "Home", state: false },
  ],
  boostrapIcon: IconNamesEnum.Speedometer2
},];
