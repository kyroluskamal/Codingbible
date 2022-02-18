import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent
{
  isDashboard: boolean = false;
  title = 'app';
  constructor(private router: Router)
  {
    this.router.events
      .pipe(
        filter(e => e instanceof NavigationEnd)
      )
      .subscribe((navEnd: any) =>
      {

        if (navEnd.url.includes("/dashboard")) this.isDashboard = true;
        else this.isDashboard = false;

      });
  }
}
