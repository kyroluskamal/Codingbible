import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'course-text-to-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './course-text-to-list.component.html',
  styleUrls: ['./course-text-to-list.component.css']
})
export class CourseTextToListComponent implements OnInit
{
  @Input() text: string = '';
  @Input() title: string = '';
  constructor() { }

  ngOnInit(): void
  {
  }

}
