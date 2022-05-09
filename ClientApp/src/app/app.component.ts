import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit 
{
  constructor(private meta: Meta, private title: Title)
  {
  }
  ngOnInit(): void
  {
    this.meta.addTag({ property: 'og:title', content: 'Angular Universal Demo' });

  }
}
