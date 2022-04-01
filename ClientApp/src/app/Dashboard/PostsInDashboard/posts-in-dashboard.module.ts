import { NgModule } from '@angular/core';
import { PostsDashboardComponent } from './posts-dashboard/posts-dashboard.component';
import { AddPostsComponent } from './add-posts/add-posts.component';
import { CodingBibleEditorComponent } from 'src/app/Dashboard/PostsInDashboard/editor/editor.component';
import { PostHandlerComponent } from './post-handler/post-handler.component';
import { EditPostComponent } from './edit-post/edit-post.component';
import { SharedModule } from 'src/SharedModules/shared.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableModule } from '@angular/material/table';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { MatInputModule } from '@angular/material/input';
import { PostsInDashboardRoutingModule } from './posts-in-dashboard-routing.module';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { FlexLayoutModule } from '@angular/flex-layout';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CodingBibleTableComponent } from 'src/app/CommonComponents/coding-bible-table/coding-bible-table.component';
import { CodingBiblePaginatorComponent } from 'src/app/CommonComponents/coding-bible-paginator/coding-bible-paginator.component';
import { HandleBooleanPipe } from 'src/Pipes/handle-boolean.pipe';
import { PostStatusPipe } from 'src/Pipes/post-status.pipe';
const components = [
  PostsDashboardComponent, AddPostsComponent, CodingBibleEditorComponent,
  PostHandlerComponent, EditPostComponent, CodingBibleTableComponent, CodingBiblePaginatorComponent
];
@NgModule({
  imports: [TooltipModule, FlexLayoutModule,
    SharedModule, MatFormFieldModule, MatTableModule, TabsModule,
    MatInputModule, PostsInDashboardRoutingModule, DragDropModule
  ],
  declarations: [components, HandleBooleanPipe, PostStatusPipe]
})
export class PostsInDashboardModule { }
