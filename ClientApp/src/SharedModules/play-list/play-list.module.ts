import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayListComponent } from './play-list/play-list.component';
import { SectionChildHomeComponent } from './section-child-home/section-child-home.component';
import { RouterModule } from '@angular/router';
import { TranslatePipe } from 'src/Pipes/translate.pipe';
import { SafeUrlPipe } from 'src/Pipes/safe-url.pipe';
import { VideoContainerComponent } from '../video-container/video-container.component';


@NgModule({
  declarations: [
    PlayListComponent, SectionChildHomeComponent
  ],
  imports: [
    CommonModule, RouterModule, TranslatePipe, VideoContainerComponent
  ],
  exports: [PlayListComponent]
})
export class PlayListModule { }
