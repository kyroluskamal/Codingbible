import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardRoutes } from '../../Helpers/router-constants';
import { NotFoundComponent } from '../CommonComponents/not-found/not-found.component';
import { DashboardHomeComponent } from './dashboard-home/dashboard-home.component';
import { AuthGuard } from 'src/guards/auth.guard';
import { PostsDashboardComponent } from './posts-dashboard/posts-dashboard.component';
import { AddPostsComponent } from './add-posts/add-posts.component';
import { EditPostComponent } from './edit-post/edit-post.component';

const routes: Routes = [
  {
    path: DashboardRoutes.Home, component: DashboardHomeComponent, children: [

      {
        path: DashboardRoutes.Posts.Home, children: [
          { path: '', component: PostsDashboardComponent },
          { path: DashboardRoutes.Posts.AddPost, component: AddPostsComponent },
          { path: DashboardRoutes.Posts.EditPost, component: EditPostComponent }
        ]
      }
    ], canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
