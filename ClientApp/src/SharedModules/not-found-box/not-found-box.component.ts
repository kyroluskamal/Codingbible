import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'not-found',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './not-found-box.component.html',
  styleUrls: ['./not-found-box.component.css']
})
export class NotFoundBoxComponent implements OnInit
{
  @Input() buttonText: string = '';
  @Input() routerlink: string[] = [];
  @Input() title: string = '';
  @Input() body: string = '';
  constructor() { }

  ngOnInit(): void
  {
  }

}
