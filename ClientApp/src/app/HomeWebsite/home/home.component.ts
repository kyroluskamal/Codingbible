import { isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
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


  constructor(@Inject(PLATFORM_ID) private platformId: Object, private store: Store) { }

  ngOnInit(): void
  {
    if (isPlatformBrowser(this.platformId))
      this.store.dispatch(LoadPOSTs());
  }

}
