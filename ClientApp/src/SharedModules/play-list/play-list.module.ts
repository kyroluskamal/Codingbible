import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayListComponent } from './play-list/play-list.component';
import { SectionChildHomeComponent } from './section-child-home/section-child-home.component';
import { SharedPipesModule } from '../shared-pipes.module';
import { RouterModule } from '@angular/router';


@NgModule({
  declarations: [
    PlayListComponent, SectionChildHomeComponent
  ],
  imports: [
    CommonModule, SharedPipesModule, RouterModule
  ],
  exports: [PlayListComponent]
})
export class PlayListModule { }
