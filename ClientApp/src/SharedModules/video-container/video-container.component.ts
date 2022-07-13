import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeUrlPipe } from 'src/Pipes/safe-url.pipe';

@Component({
  selector: 'youtube-container',
  standalone: true,
  imports: [SafeUrlPipe],
  templateUrl: './video-container.component.html',
  styleUrls: ['./video-container.component.css']
})
export class VideoContainerComponent implements OnInit
{
  @Input() videoId: string = '';
  constructor() { }

  ngOnInit(): void
  {
  }

}
