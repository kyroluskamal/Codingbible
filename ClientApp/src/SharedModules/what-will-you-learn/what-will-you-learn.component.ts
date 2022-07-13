import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'what-will-you-learn',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './what-will-you-learn.component.html',
  styleUrls: ['./what-will-you-learn.component.css']
})
export class WhatWillYouLearnComponent implements OnInit
{
  @Input() whatWillYouLearn: string = '';
  @Input() title: string = '';
  constructor() { }

  ngOnInit(): void
  {
  }

}
