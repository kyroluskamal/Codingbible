import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from '../CommonComponents/not-found/not-found.component';
const routes: Routes = [
  { path: "**", component: NotFoundComponent }
];




@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes/*, { enableTracing: true }*/)],
  exports: [RouterModule]

})
export class AppRoutingModule { }
