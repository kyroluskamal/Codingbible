import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectLang } from 'src/State/LangState/lang.reducer';

@Component({
  selector: 'app-courses-home',
  templateUrl: './courses-home.component.html',
  styleUrls: ['./courses-home.component.css']
})
export class CoursesHomeComponent implements OnInit
{
  isArabic = this.store.select(selectLang);

  constructor(private store: Store) { }

  ngOnInit(): void
  {
  }

}
