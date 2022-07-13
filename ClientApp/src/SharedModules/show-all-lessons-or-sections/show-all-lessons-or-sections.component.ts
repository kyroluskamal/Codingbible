import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'show-all',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './show-all-lessons-or-sections.component.html',
  styleUrls: ['./show-all-lessons-or-sections.component.css']
})
export class ShowAllLessonsOrSectionsComponent implements OnInit
{
  @Input() buttonText: string = '';
  @Input() routerlink: string[] = [];
  @Input() courseName: string = '';
  @Input() title: string = '';
  @Input() body: string = '';
  constructor() { }

  ngOnInit(): void
  {
  }

}
