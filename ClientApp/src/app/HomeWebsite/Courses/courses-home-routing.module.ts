import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CoursesHomeComponent } from './courses-home/courses-home.component';

const routes: Routes = [
  { path: '', component: CoursesHomeComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoursesHomeRoutingModule { }
