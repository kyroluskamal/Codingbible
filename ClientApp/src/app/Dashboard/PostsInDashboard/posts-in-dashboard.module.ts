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
import { HandleBooleanPipe } from 'src/Pipes/handle-boolean.pipe';
import { ShareComponentsforDashboardModule } from 'src/SharedModules/share-componentsfor-dashboard.module';
import { BypassStylePipe } from 'src/Pipes/bypass-style.pipe';
const components = [
  PostsDashboardComponent, AddPostsComponent,
  PostHandlerComponent, EditPostComponent];
@NgModule({
  imports: [TooltipModule, FlexLayoutModule, ShareComponentsforDashboardModule,
    SharedModule, MatFormFieldModule, MatTableModule, TabsModule, BypassStylePipe,
    MatInputModule, PostsInDashboardRoutingModule,
  ],
  declarations: [components, HandleBooleanPipe]
})
export class PostsInDashboardModule { }
