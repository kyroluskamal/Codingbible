import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MediaComponent } from "../app/Dashboard/media/media.component";
import { BootstrapMoalComponent } from 'src/app/CommonComponents/bootstrap-modal/bootstrap-modal.component';
import { CodingBibleTableComponent } from 'src/app/CommonComponents/coding-bible-table/coding-bible-table.component';
import { CodingBiblePaginatorComponent } from 'src/app/CommonComponents/coding-bible-paginator/coding-bible-paginator.component';
import { PostStatusPipe } from 'src/Pipes/post-status.pipe';
import { NgxSpinnerModule } from 'ngx-spinner';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { FileSizePipe } from 'src/Pipes/file-size.pipe';
import { ReactiveFormsModule } from '@angular/forms';
import { CodingBibleEditorComponent } from 'src/app/Dashboard/PostsInDashboard/editor/editor.component';
import { ImageUrlForScreen } from 'src/Pipes/ImageUrlForScreen.pipe';
const components = [MediaComponent, BootstrapMoalComponent,
  PostStatusPipe, FileSizePipe,
  CodingBibleEditorComponent,
  CodingBiblePaginatorComponent, CodingBibleTableComponent];

@NgModule({
  declarations: [components],
  imports: [
    CommonModule, NgxSpinnerModule.forRoot({ type: "ball-scale-multiple" }), TooltipModule, ReactiveFormsModule, ImageUrlForScreen
  ],
  exports: [components, ImageUrlForScreen]
})
export class ShareComponentsforDashboardModule { }
