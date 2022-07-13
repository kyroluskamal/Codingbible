import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from 'src/Pipes/translate.pipe';

@Component({
  selector: 'description',
  standalone: true,
  templateUrl: './description.component.html',
  styleUrls: ['./description.component.css']
})
export class DescriptionComponent implements OnInit
{
  @Input() description: string | undefined = '';
  @Input() title: string = '';
  constructor() { }

  ngOnInit(): void
  {
  }

}
