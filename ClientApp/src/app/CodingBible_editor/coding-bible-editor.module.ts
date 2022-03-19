import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CodingBibleEditorComponent } from './editor/editor.component';
import { eraserFill, NgxBootstrapIconsModule, typeBold, typeItalic, typeStrikethrough, typeUnderline } from 'ngx-bootstrap-icons';

const icons = {
  typeBold, typeItalic, typeUnderline, eraserFill, typeStrikethrough
};
const commponents = [CodingBibleEditorComponent];
@NgModule({
  declarations: [CodingBibleEditorComponent],
  imports: [
    CommonModule, NgxBootstrapIconsModule.pick(icons),
  ],
  exports: [commponents]
})
export class CodingBibleEditorModule { }
