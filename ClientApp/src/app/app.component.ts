import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

declare let gtag: Function;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit 
{
  constructor(private meta: Meta, private title: Title, private router: Router)
  {
  }
  ngOnInit(): void
  {
    this.meta.addTag({ property: 'og:title', content: 'Angular Universal Demo' });
    this.router.events.subscribe((event) =>
    {
      if (event instanceof NavigationEnd)
      {
        gtag('config', 'G-CL5BP722M6', { 'page_path': event.urlAfterRedirects });
      }
    });
  }
}
