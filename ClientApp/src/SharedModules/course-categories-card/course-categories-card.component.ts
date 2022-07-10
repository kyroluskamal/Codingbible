import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CourseCategory } from 'src/models.model';
import { RouterModule } from '@angular/router';
import { TranslatePipe } from 'src/Pipes/translate.pipe';

@Component({
  selector: 'course-categories-card',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslatePipe],
  templateUrl: './course-categories-card.component.html',
  styleUrls: ['./course-categories-card.component.css']
})
export class CourseCategoriesCardComponent implements OnInit
{
  @Input() Category: CourseCategory | null = null;
  constructor() { }

  ngOnInit(): void
  {
  }

}
