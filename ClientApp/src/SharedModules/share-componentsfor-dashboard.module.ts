import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MediaComponent } from "../app/Dashboard/media/media.component";
import { BootstrapMoalComponent } from 'src/app/CommonComponents/bootstrap-modal/bootstrap-modal.component';
import { CodingBibleTableComponent } from 'src/app/CommonComponents/coding-bible-table/coding-bible-table.component';
import { CodingBiblePaginatorComponent } from 'src/app/CommonComponents/coding-bible-paginator/coding-bible-paginator.component';
import { PostStatusPipe } from 'src/Pipes/post-status.pipe';
import { NgxSpinnerModule } from 'ngx-spinner';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
const components = [MediaComponent, BootstrapMoalComponent, PostStatusPipe,
  CodingBiblePaginatorComponent, CodingBibleTableComponent];

@NgModule({
  declarations: [components],
  imports: [
    CommonModule, NgxSpinnerModule, TooltipModule
  ],
  exports: [components]
})
export class ShareComponentsforDashboardModule { }
