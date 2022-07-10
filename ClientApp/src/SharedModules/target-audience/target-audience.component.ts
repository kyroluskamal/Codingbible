import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'target-audience',
  standalone: true,
  templateUrl: './target-audience.component.html',
  styleUrls: ['./target-audience.component.css']
})
export class TargetAudienceComponent implements OnInit
{
  @Input() targetAudience: string = '';
  @Input() isArabic: boolean = false;
  @Input() title: string = '';
  constructor() { }

  ngOnInit(): void
  {
  }

}
