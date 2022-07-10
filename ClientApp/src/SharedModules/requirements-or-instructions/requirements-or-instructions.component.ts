import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'requirements',
  standalone: true,
  templateUrl: './requirements-or-instructions.component.html',
  styleUrls: ['./requirements-or-instructions.component.css']
})
export class RequirementsOrInstructionsComponent implements OnInit
{
  @Input() requirementsOrInstructions: string = '';
  @Input() isArabic: boolean = false;
  @Input() title: string = '';
  constructor() { }

  ngOnInit(): void
  {
  }

}
