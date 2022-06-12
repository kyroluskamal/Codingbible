import { isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, Input, OnInit, PLATFORM_ID } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { Store } from '@ngrx/store';
import { selectLang } from 'src/State/LangState/lang.reducer';
import { LoadPOSTs } from 'src/State/PostState/post.actions';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit
{
  isArabic = this.store.select(selectLang);
  constructor(private store: Store, private title: Title, private meta: Meta) { }

  ngOnInit(): void
  {
    this.meta.addTag({ property: 'og:title', content: 'Angular Universal Demo' });

    this.store.dispatch(LoadPOSTs());
  }

}
