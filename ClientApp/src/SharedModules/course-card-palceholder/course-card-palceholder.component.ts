import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageTitlePlaceHolderComponent } from '../page-title-place-holder/page-title-place-holder.component';

@Component({
  selector: 'course-card-palceholder',
  standalone: true,
  imports: [PageTitlePlaceHolderComponent],
  templateUrl: './course-card-palceholder.component.html',
  styleUrls: ['./course-card-palceholder.component.css']
})
export class CourseCardPalceholderComponent implements OnInit
{
  constructor() { }

  ngOnInit(): void
  {
  }

}
