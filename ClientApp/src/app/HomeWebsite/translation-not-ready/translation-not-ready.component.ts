import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { SharedModuleForHomeModule } from 'src/SharedModules/shared-module-for-home.module';
import { TranslatePipe } from 'src/Pipes/translate.pipe';
import { Store } from '@ngrx/store';
import { selectLang } from 'src/State/LangState/lang.reducer';

@Component({
  selector: 'app-translation-not-ready',
  standalone: true,
  imports: [SharedModuleForHomeModule, TranslatePipe],
  providers: [],
  templateUrl: './translation-not-ready.component.html',
  styleUrls: ['./translation-not-ready.component.css']
})
export class TranslationNotReadyComponent implements OnInit
{
  isArabic = this.store.select(selectLang);
  constructor(private store: Store,
    private _location: Location) { }

  ngOnInit(): void
  {
  };
  goBack()
  {
    this._location.back();
  }
}
