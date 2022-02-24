import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CodingBibleEditorComponent } from './editor/editor.component';
import { MaterialModule } from 'src/SharedModules/material.module';
import { SharedModule } from 'src/SharedModules/shared.module';


const commponents = [CodingBibleEditorComponent];
@NgModule({
  declarations: [CodingBibleEditorComponent],
  imports: [
    CommonModule, MaterialModule, SharedModule
  ],
  exports: [commponents]
})
export class CodingBibleEditorModule { }
