import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayListComponent } from './play-list/play-list.component';
import { SectionChildHomeComponent } from './section-child-home/section-child-home.component';
import { SharedPipesModule } from '../shared-pipes.module';


@NgModule({
  declarations: [
    PlayListComponent, SectionChildHomeComponent
  ],
  imports: [
    CommonModule, SharedPipesModule,
  ],
  exports: [PlayListComponent]
})
export class PlayListModule { }
