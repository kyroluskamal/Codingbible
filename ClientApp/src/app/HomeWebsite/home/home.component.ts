import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { LoadPOSTs } from 'src/State/PostState/post.actions';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit
{


  constructor(private store: Store) { }

  ngOnInit(): void
  {
    this.store.dispatch(LoadPOSTs());
  }

}
