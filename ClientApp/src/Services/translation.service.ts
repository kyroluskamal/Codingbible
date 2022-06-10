import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class TranslationService
{

  //properties
  SelectedLang: any = 'en';
  languages: string[] = ['en', 'ar'];
  selected: any = "en";
  _onLangChange: any;
  //constructor
  constructor(public translate: TranslateService)
  {
    translate.addLangs(this.languages);
    translate.setDefaultLang(this.SelectedLang);
    this.SelectedLang = localStorage.getItem('lang');
    if (!localStorage.getItem('lang') && (JSON.parse(this.SelectedLang) === undefined || JSON.parse(this.SelectedLang) === null))
    {
      this.setTranslationLang('en');
    } else
    {
      this.setTranslationLang(this.SelectedLang);
    }
  }

  setTranslationLang(lang: any)
  {
    this.translate.use(lang);
    localStorage.setItem("lang", lang);
    this.selected = localStorage.getItem('lang');
    return this.selected;
  }

  getLangs()
  {
    return this.translate.getLangs();
  }

  GetTranslation(key: string)
  {
    return this.translate.instant(key);
  }
  GetCurrentLang()
  {
    return this.translate.currentLang;
  }

  TranslationObservable()
  {
    return this.translate.getTranslation(this.GetCurrentLang());
  }
  isRTL(lang: any)
  {
    switch (lang)
    {
      case 'ar': return true;
      case 'arc': return true;
      case 'dv': return true;
      case 'fa': return true;
      case 'ha': return true;
      case 'he': return true;
      case 'khw': return true;
      case 'ks': return true;
      case 'ku': return true;
      case 'ps': return true;
      case 'ur': return true;
      case 'yi': return true;
      default: return false;
    }
  }
}
