import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { MenusComponent } from "./menus/menus.component";

const PostsInDashboardRoutes: Routes = [
    { path: "", component: MenusComponent },
];

@NgModule({
    imports: [RouterModule.forChild(PostsInDashboardRoutes)],
    exports: [RouterModule]
})
export class MenusRoutingModule { }