import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ArabicHomeComponent } from './arabic-home/arabic-home.component';

const routes: Routes = [
  { path: '', component: ArabicHomeComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ArabicRoutingModule { }
