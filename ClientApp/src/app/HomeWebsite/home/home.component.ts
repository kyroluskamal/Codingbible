import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { HomeRoutes } from 'src/Helpers/router-constants';
import { TranslatePipe } from 'src/Pipes/translate.pipe';
import { TitleAndMetaService } from 'src/Services/title-and-meta.service';
import { selectLang } from 'src/State/LangState/lang.reducer';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [TranslatePipe]
})
export class HomeComponent implements OnInit
{
  isArabic = this.store.select(selectLang);
  HomeRoutes = HomeRoutes;
  constructor(private store: Store, private translate: TranslatePipe, private TitleAndMetaService: TitleAndMetaService) { }
  ngOnInit(): void
  {
    this.isArabic.subscribe(lang =>
    {
      this.TitleAndMetaService.setSEO_Requirements(this.translate.transform('Learn Computer Science and progrmming'),
        this.translate.transform('firstSectionText'), '/assets/img/coding-bible-home-page.webp', "", lang);
    });
  }

}
