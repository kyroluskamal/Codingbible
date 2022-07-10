import { Component, Input, OnInit } from '@angular/core';
import { TranslatePipe } from 'src/Pipes/translate.pipe';

@Component({
  selector: 'page-title',
  templateUrl: './page-title.component.html',
  styleUrls: ['./page-title.component.css'],
  standalone: true,
})
export class PageTitleComponent implements OnInit
{
  @Input() title: string = '';
  @Input() description: string = '';
  constructor() { }

  ngOnInit(): void
  {
  }

}
