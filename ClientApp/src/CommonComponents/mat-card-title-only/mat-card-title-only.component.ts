import { Component, Inject, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { CardTitle, ThemeColor } from '../../Interfaces/interfaces';
@Component({
  selector: 'mat-card-title-only',
  templateUrl: './mat-card-title-only.component.html',
  styleUrls: ['./mat-card-title-only.component.css']
})
export class MatCardTitleOnlyComponent implements OnInit
{
  @Input() Title: CardTitle[] = [];
  @Input() Subtitle: CardTitle[] = [];
  constructor(
  )
  {

  }

  ngOnInit(): void
  {
  }

}
