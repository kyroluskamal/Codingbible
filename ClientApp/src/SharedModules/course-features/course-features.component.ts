import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'course-features',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './course-features.component.html',
  styleUrls: ['./course-features.component.css']
})
export class CourseFeaturesComponent implements OnInit
{
  @Input() courseFeatures: string = '';
  @Input() title: string = '';
  constructor() { }

  ngOnInit(): void
  {
  }

}
