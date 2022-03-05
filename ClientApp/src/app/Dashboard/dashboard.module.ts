import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardHomeComponent } from './dashboard-home/dashboard-home.component';
import { MaterialModule } from '../../SharedModules/material.module';
import { SharedModule } from '../../SharedModules/shared.module';
import { PostsDashboardComponent } from './posts-dashboard/posts-dashboard.component';
import { AddPostsComponent } from './add-posts/add-posts.component';
import { EditorModule, TINYMCE_SCRIPT_SRC } from '@tinymce/tinymce-angular';
import { CodingBibleEditorModule } from '../CodingBible_editor/coding-bible-editor.module';
import { PostHandlerComponent } from './post-handler/post-handler.component';
import { EditPostComponent } from './edit-post/edit-post.component';
import { MatCardTitleOnlyComponent } from '../CommonComponents/mat-card-title-only/mat-card-title-only.component';

const components = [
  DashboardHomeComponent, PostsDashboardComponent, AddPostsComponent, MatCardTitleOnlyComponent
];
@NgModule({
  declarations: [components, PostHandlerComponent, EditPostComponent],
  imports: [
    CommonModule, MaterialModule, SharedModule,
    DashboardRoutingModule, EditorModule,
    CodingBibleEditorModule
  ],
  exports: [components]
  ,
  providers: [
    { provide: TINYMCE_SCRIPT_SRC, useValue: 'tinymce/tinymce.min.js' }
  ]
})
export class DashboardModule { }
