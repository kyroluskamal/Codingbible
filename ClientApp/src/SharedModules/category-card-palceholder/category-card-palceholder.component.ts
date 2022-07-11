import { Component, OnInit } from '@angular/core';
import { PageTitlePlaceHolderComponent } from '../page-title-place-holder/page-title-place-holder.component';

@Component({
  selector: 'category-card-palceholder',
  standalone: true,
  imports: [PageTitlePlaceHolderComponent],
  templateUrl: './category-card-palceholder.component.html',
  styleUrls: ['./category-card-palceholder.component.css']
})
export class CategoryCardPalceholderComponent implements OnInit
{

  constructor() { }

  ngOnInit(): void
  {
  }

}
