import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeUrlPipe } from 'src/Pipes/safe-url.pipe';
import { TranslatePipe } from 'src/Pipes/translate.pipe';
import { VideoContainerComponent } from '../video-container/video-container.component';

@Component({
  selector: 'introductoy-video',
  standalone: true,
  imports: [VideoContainerComponent],
  templateUrl: './introductoy-video.component.html',
  styleUrls: ['./introductoy-video.component.css']
})
export class IntroductoyVideoComponent implements OnInit 
{
  @Input() videoId: string = '';
  @Input() title: string = '';
  constructor() { }

  ngOnInit(): void
  {

  }

}
