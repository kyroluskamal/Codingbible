import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { LangState } from 'src/State/app.state';
import { selectLang } from 'src/State/LangState/lang.reducer';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit
{
  isArabic = this.store.select(selectLang);
  constructor(private store: Store<LangState>) { }

  ngOnInit(): void
  {
  }

}
