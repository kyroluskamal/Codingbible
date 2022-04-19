import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit 
{
  constructor(private meta: Meta, private title: Title)
  {
  }
  ngOnInit(): void
  {
    this.title.setTitle('Home|');
    this.meta.addTag({ property: 'og:title', content: 'Angular Universal Demo' });

  }
}
