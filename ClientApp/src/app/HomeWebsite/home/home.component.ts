import { isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { Store } from '@ngrx/store';
import { LoadPOSTs } from 'src/State/PostState/post.actions';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit
{
  constructor(private store: Store, private title: Title, private meta: Meta) { }

  ngOnInit(): void
  {
    this.title.setTitle('Home|');
    this.meta.addTag({ property: 'og:title', content: 'Angular Universal Demo' });

    this.store.dispatch(LoadPOSTs());
  }

}
