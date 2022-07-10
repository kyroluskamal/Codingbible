import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Course } from 'src/models.model';
import { TranslatePipe } from 'src/Pipes/translate.pipe';
import { BaseUrl } from 'src/Helpers/constants';
import { RouterModule } from '@angular/router';
import { HomeRoutes } from 'src/Helpers/router-constants';

@Component({
  selector: 'course-card',
  standalone: true,
  imports: [RouterModule, CommonModule, TranslatePipe],
  templateUrl: './course-card.component.html',
  styleUrls: ['./course-card.component.css']
})
export class CourseCardComponent implements OnInit
{
  @Input() Course: Course | null = null;
  BaseUrl = BaseUrl;
  CourseRoutes = HomeRoutes.Courses;
  constructor() { }

  ngOnInit(): void
  {
  }

}
