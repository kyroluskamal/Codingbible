import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { SET_LANGUAGE } from 'src/State/LangState/lang.acitons';

@Component({
  selector: 'app-arabic-home',
  templateUrl: './arabic-home.component.html',
  styleUrls: ['./arabic-home.component.css']
})
export class ArabicHomeComponent implements OnInit
{

  constructor(private store: Store) { }

  ngOnInit(): void
  {
    this.store.dispatch(SET_LANGUAGE({ isArabic: true }));
  }

}
