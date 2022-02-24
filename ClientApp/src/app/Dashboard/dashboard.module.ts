import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { CommonComponentsModule } from '../CommonComponents/common-components.module';
import { DashboardHomeComponent } from './dashboard-home/dashboard-home.component';
import { MaterialModule } from '../../SharedModules/material.module';
import { SharedModule } from '../../SharedModules/shared.module';
import { PostsDashboardComponent } from './posts-dashboard/posts-dashboard.component';
import { AddPostsComponent } from './add-posts/add-posts.component';
import { EditorModule, TINYMCE_SCRIPT_SRC } from '@tinymce/tinymce-angular';
import { CodingBibleEditorModule } from '../CodingBible_editor/coding-bible-editor.module';

const components = [
  DashboardHomeComponent, PostsDashboardComponent, AddPostsComponent
];
@NgModule({
  declarations: [components],
  imports: [
    CommonModule, MaterialModule, SharedModule,
    DashboardRoutingModule, EditorModule,
    CommonComponentsModule, CodingBibleEditorModule
  ],
  exports: [components]
  ,
  providers: [
    { provide: TINYMCE_SCRIPT_SRC, useValue: 'tinymce/tinymce.min.js' }
  ]
})
export class DashboardModule { }
