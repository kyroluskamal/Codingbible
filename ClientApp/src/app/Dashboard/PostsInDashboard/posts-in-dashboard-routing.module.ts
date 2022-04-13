import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { DashboardRoutes } from "src/Helpers/router-constants";
import { AddPostsComponent } from "./add-posts/add-posts.component";
import { EditPostComponent } from "./edit-post/edit-post.component";
import { PostsDashboardComponent } from "./posts-dashboard/posts-dashboard.component";

const PostsInDashboardRoutes: Routes = [
    { path: "", component: PostsDashboardComponent },
    { path: DashboardRoutes.Posts.AddPost, component: AddPostsComponent },
    { path: DashboardRoutes.Posts.EditPost, component: EditPostComponent },
    { path: DashboardRoutes.Posts.Categoris, loadChildren: () => import("./categories/categories.module").then(m => m.CategoriesModule) },
];

@NgModule({
    imports: [RouterModule.forChild(PostsInDashboardRoutes)],
    exports: [RouterModule]
})
export class PostsInDashboardRoutingModule { }