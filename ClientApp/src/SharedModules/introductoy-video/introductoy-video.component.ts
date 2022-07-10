import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeUrlPipe } from 'src/Pipes/safe-url.pipe';
import { TranslatePipe } from 'src/Pipes/translate.pipe';

@Component({
  selector: 'introductoy-video',
  standalone: true,
  imports: [SafeUrlPipe],
  templateUrl: './introductoy-video.component.html',
  styleUrls: ['./introductoy-video.component.css']
})
export class IntroductoyVideoComponent implements OnInit 
{
  @Input() videoId: string = '';
  @Input() title: string = '';
  @Input() isArabic: boolean = false;
  constructor() { }

  ngOnInit(): void
  {

  }

}
