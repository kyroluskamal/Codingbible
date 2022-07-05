import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllSectionsHomeComponent } from './all-sections-home/all-sections-home.component';
import { ShowSectionConctentComponent } from './show-section-conctent/show-section-conctent.component';

const routes: Routes = [
  { path: '', component: AllSectionsHomeComponent },
  { path: ':slug', component: ShowSectionConctentComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShowSectionRoutingModule { }
